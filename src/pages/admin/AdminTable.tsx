import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { extSupabase, adminMutate } from "@/lib/adminClient";
import { getTableConfig, FieldDef } from "./adminConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, RefreshCw } from "lucide-react";

type Row = Record<string, any>;

const truncate = (val: unknown, max = 60) => {
  if (val == null) return "";
  const s = typeof val === "string" ? val : JSON.stringify(val);
  return s.length > max ? s.slice(0, max) + "…" : s;
};

const AdminTable = () => {
  const { tableKey } = useParams<{ tableKey: string }>();
  const config = useMemo(() => (tableKey ? getTableConfig(tableKey) : undefined), [tableKey]);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [formState, setFormState] = useState<Row>({});
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    if (!config) return;
    setLoading(true);
    let q = extSupabase.from(config.table).select("*");
    if (config.orderBy) {
      q = q.order(config.orderBy, { ascending: config.orderAsc ?? true });
    }
    const { data, error } = await q.range(0, 9999);
    if (error) {
      toast({ title: "Load failed", description: error.message, variant: "destructive" });
    } else {
      setRows(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableKey]);

  if (!config) return <div className="p-8">Unknown table.</div>;

  const openCreate = () => {
    const blank: Row = {};
    config.fields.forEach((f) => {
      blank[f.key] = f.type === "boolean" ? false : "";
    });
    setFormState(blank);
    setCreating(true);
  };

  const openEdit = (row: Row) => {
    const init: Row = {};
    config.fields.forEach((f) => {
      const v = row[f.key];
      init[f.key] =
        f.type === "json" && v != null && typeof v !== "string"
          ? JSON.stringify(v, null, 2)
          : v ?? (f.type === "boolean" ? false : "");
    });
    setFormState(init);
    setEditing(row);
  };

  const closeForm = () => {
    setEditing(null);
    setCreating(false);
    setFormState({});
  };

  const buildValues = () => {
    const out: Row = {};
    for (const f of config.fields) {
      let v = formState[f.key];
      if (f.type === "number") {
        v = v === "" || v == null ? null : Number(v);
      } else if (f.type === "boolean") {
        v = !!v;
      } else if (f.type === "json") {
        if (typeof v === "string" && v.trim() !== "") {
          try {
            v = JSON.parse(v);
          } catch {
            throw new Error(`Invalid JSON in field "${f.label}"`);
          }
        } else if (v === "" || v == null) {
          v = null;
        }
      } else if (typeof v === "string") {
        v = v === "" ? null : v;
      }
      out[f.key] = v;
    }
    return out;
  };

  const save = async () => {
    setSaving(true);
    try {
      const values = buildValues();
      if (editing) {
        await adminMutate("update", config.table, {
          values,
          match: { [config.pk]: editing[config.pk] },
        });
        toast({ title: "Updated" });
      } else {
        await adminMutate("insert", config.table, { values });
        toast({ title: "Created" });
      }
      closeForm();
      await load();
    } catch (err) {
      toast({
        title: "Save failed",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: Row) => {
    if (!confirm(`Delete this row from ${config.label}?`)) return;
    try {
      await adminMutate("delete", config.table, {
        match: { [config.pk]: row[config.pk] },
      });
      toast({ title: "Deleted" });
      await load();
    } catch (err) {
      toast({
        title: "Delete failed",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  const renderField = (f: FieldDef) => {
    const val = formState[f.key];
    const set = (v: unknown) => setFormState((s) => ({ ...s, [f.key]: v }));
    switch (f.type) {
      case "textarea":
      case "markdown":
        return (
          <Textarea
            value={val ?? ""}
            onChange={(e) => set(e.target.value)}
            rows={f.type === "markdown" ? 14 : 5}
            placeholder={f.placeholder}
            className="font-mono text-xs"
          />
        );
      case "json":
        return (
          <Textarea
            value={typeof val === "string" ? val : val ? JSON.stringify(val, null, 2) : ""}
            onChange={(e) => set(e.target.value)}
            rows={6}
            placeholder={f.placeholder}
            className="font-mono text-xs"
          />
        );
      case "boolean":
        return (
          <div className="flex items-center gap-2">
            <Switch checked={!!val} onCheckedChange={(v) => set(v)} />
            <span className="text-xs text-muted-foreground">{val ? "Yes" : "No"}</span>
          </div>
        );
      case "number":
        return (
          <Input
            type="number"
            value={val ?? ""}
            onChange={(e) => set(e.target.value)}
            placeholder={f.placeholder}
          />
        );
      case "image":
        return (
          <div className="space-y-2">
            <Input
              value={val ?? ""}
              onChange={(e) => set(e.target.value)}
              placeholder="https://…"
            />
            {val && typeof val === "string" && (
              <img
                src={val}
                alt=""
                className="h-20 w-20 object-cover border border-border"
                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
              />
            )}
          </div>
        );
      default:
        return (
          <Input
            value={val ?? ""}
            onChange={(e) => set(e.target.value)}
            placeholder={f.placeholder}
          />
        );
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-light">{config.label}</h1>
          <p className="text-xs text-muted-foreground">
            {rows.length} row{rows.length === 1 ? "" : "s"} · table <code>{config.table}</code>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} className="rounded-none">
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
          {!config.noCreate && (
            <Button size="sm" onClick={openCreate} className="rounded-none">
              <Plus className="w-4 h-4 mr-1" /> New
            </Button>
          )}
        </div>
      </div>

      <div className="border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider">
            <tr>
              {config.listColumns.map((c) => (
                <th key={c} className="px-3 py-2 font-medium">
                  {c}
                </th>
              ))}
              <th className="px-3 py-2 w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={config.listColumns.length + 1} className="px-3 py-8 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={config.listColumns.length + 1} className="px-3 py-8 text-center text-muted-foreground">
                  No rows yet.
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={String(row[config.pk] ?? i)} className="border-t border-border hover:bg-muted/30">
                  {config.listColumns.map((c) => (
                    <td key={c} className="px-3 py-2 align-top">
                      {typeof row[c] === "boolean" ? (
                        <span className={row[c] ? "text-green-600" : "text-muted-foreground"}>
                          {row[c] ? "yes" : "no"}
                        </span>
                      ) : (
                        truncate(row[c])
                      )}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right">
                    <div className="inline-flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(row)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      {!config.noDelete && (
                        <Button size="icon" variant="ghost" onClick={() => remove(row)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={creating || !!editing} onOpenChange={(o) => !o && closeForm()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Edit ${config.label}` : `New ${config.label}`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {config.fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label className="text-xs">
                  {f.label}
                  {f.required && <span className="text-destructive"> *</span>}
                </Label>
                {renderField(f)}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={closeForm}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTable;
