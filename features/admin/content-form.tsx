"use client";

import Link from "next/link";
import { useActionState, useEffect, useState, type ReactNode } from "react";
import { Button, buttonClasses } from "@/components/ui/button";
import { FormMessage, SelectField, TextArea, TextField } from "@/components/ui/field";
import { STATUS_LABELS } from "@/lib/auth/roles";
import { AUTHORS } from "@/lib/content/sample-data";
import type { ContentStatus } from "@/lib/content/types";
import { FORMATS, RUBRIQUES, type Format } from "@/lib/rubriques";
import { saveContent } from "./actions";
import type { ContentFormState, FormValues } from "./content-values";
import { StatusBadge } from "./ui";

export type FormPermissions = {
  edit: boolean;
  submit: boolean;
  requestChanges: boolean;
  approve: boolean;
  publish: boolean;
  unpublish: boolean;
  chooseAuthor: boolean;
  markSponsored: boolean;
};

type Props = {
  id?: string;
  status: ContentStatus;
  initialValues: FormValues;
  permissions: FormPermissions;
  reviewNote?: string;
  publicHref?: string;
  deepDiveOptions: { value: string; label: string }[];
  notice?: string;
  history?: ReactNode;
  dangerZone?: ReactNode;
};

const initialState: ContentFormState = { status: "idle" };

export function ContentForm({
  id,
  status,
  initialValues,
  permissions: can,
  reviewNote,
  publicHref,
  deepDiveOptions,
  notice,
  history,
  dangerZone,
}: Props) {
  const [state, action, pending] = useActionState(saveContent, initialState);
  const v = state.values ?? initialValues;
  const e = state.fieldErrors ?? {};
  const format = v.format as Format;
  const published = status === "published";
  const isNew = !id;

  // Avertit avant de quitter la page avec des modifications non enregistrées.
  const [dirty, setDirty] = useState(false);
  const [chapoLength, setChapoLength] = useState(v.chapo.length);
  // Après chaque action, le formulaire repart des valeurs renvoyées par le serveur.
  const [seenState, setSeenState] = useState(state);
  if (seenState !== state) {
    setSeenState(state);
    if (state.status === "success") setDirty(false);
    setChapoLength(v.chapo.length);
  }
  useEffect(() => {
    if (!dirty) return;
    const warn = (ev: BeforeUnloadEvent) => ev.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const intentButton = (intent: string, label: string, variant: "primary" | "secondary" = "secondary") => (
    <Button type="submit" name="intent" value={intent} variant={variant} disabled={pending} className="w-full">
      {pending ? "Patientez…" : label}
    </Button>
  );

  return (
    <>
    <form action={action} onInput={() => setDirty(true)} noValidate>
      {id ? <input type="hidden" name="id" value={id} /> : null}

      <div className="space-y-3">
        {notice && state.status === "idle" ? <FormMessage status="success">{notice}</FormMessage> : null}
        {state.status !== "idle" && state.message ? (
          <FormMessage status={state.status === "error" ? "error" : "success"}>{state.message}</FormMessage>
        ) : null}
        {status === "draft" && reviewNote ? (
          <div className="border-l-4 border-bordeaux bg-creme px-4 py-3">
            <p className="font-bold">Modifications demandées par l&apos;édition</p>
            <p className="mt-1">« {reviewNote} »</p>
          </div>
        ) : null}
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <fieldset disabled={!can.edit} className="min-w-0 space-y-10">
          <legend className="sr-only">Contenu</legend>
          {!can.edit ? (
            <p className="border-l-4 border-violet bg-creme px-4 py-3">
              Ce contenu est {STATUS_LABELS[status].toLowerCase()} : vous ne pouvez plus le modifier. L&apos;édition
              peut vous le renvoyer si des changements sont nécessaires.
            </p>
          ) : null}

          <Section title="L'essentiel">
            <SelectField
              name="format"
              label="Format"
              required
              defaultValue={v.format}
              disabled={!isNew && status !== "draft"}
              options={(Object.keys(FORMATS) as Format[]).map((f) => ({ value: f, label: FORMATS[f].label }))}
              hint={!isNew && status !== "draft" ? "Le format ne change plus après la relecture." : undefined}
              error={e.format}
            />
            {!isNew && status !== "draft" ? <input type="hidden" name="format" value={v.format} /> : null}
            <TextField name="title" label="Titre" required maxLength={140} defaultValue={v.title} error={e.title} />
            <TextArea
              name="chapo"
              label="Chapô"
              required
              rows={4}
              maxLength={400}
              defaultValue={v.chapo}
              onChange={(ev) => setChapoLength(ev.currentTarget.value.length)}
              hint={`Deux ou trois phrases qui donnent envie de lire. ${chapoLength} / 400 caractères (40 minimum).`}
              error={e.chapo}
            />
            <div className="grid gap-6 md:grid-cols-2">
              <SelectField
                name="rubrique"
                label="Rubrique"
                required
                defaultValue={v.rubrique}
                disabled={published}
                options={RUBRIQUES.map((r) => ({ value: r.slug, label: r.name }))}
                error={e.rubrique}
              />
              {can.chooseAuthor ? (
                <SelectField
                  name="authorSlug"
                  label="Auteur affiché"
                  required
                  defaultValue={v.authorSlug}
                  options={AUTHORS.map((a) => ({ value: a.slug, label: a.name }))}
                  error={e.authorSlug}
                />
              ) : (
                <div>
                  <p className="font-bold">Auteur affiché</p>
                  <p className="mt-2 min-h-11 py-2">{AUTHORS.find((a) => a.slug === v.authorSlug)?.name ?? "—"}</p>
                </div>
              )}
            </div>
            <TextField
              name="slug"
              label="Adresse de la page"
              defaultValue={v.slug}
              disabled={published}
              placeholder="générée à partir du titre"
              hint={
                published
                  ? "Un contenu publié garde son adresse, pour ne pas casser les liens partagés."
                  : `/mag/${v.rubrique}/${v.slug || "…"} — laissez vide pour la générer à partir du titre.`
              }
              error={e.slug}
            />
          </Section>

          <Section title="Image de une">
            <p className="text-[0.9375rem]">
              Le téléversement de la photo arrive avec la médiathèque. En attendant, renseignez sa description et son
              crédit : ils sont obligatoires.
            </p>
            <TextField
              name="coverAlt"
              label="Description de l'image (texte alternatif)"
              required
              defaultValue={v.coverAlt}
              hint="Ce que montre la photo, pour les personnes qui ne la voient pas."
              error={e.coverAlt}
            />
            <div className="grid gap-6 md:grid-cols-2">
              <TextField name="coverCredit" label="Crédit" required defaultValue={v.coverCredit} placeholder="Nom du photographe / agence" error={e.coverCredit} />
              <TextField name="coverRights" label="Droits d'utilisation" defaultValue={v.coverRights} placeholder="Ex. : cession écrite du 12/10/2026" error={e.coverRights} />
            </div>
          </Section>

          {format === "entretien" ? (
            <Section title="Entretien">
              <TextField name="guest" label="Personne interviewée" required defaultValue={v.guest} error={e.guest} />
              <TextField
                name="videoId"
                label="Vidéo YouTube (identifiant)"
                defaultValue={v.videoId}
                hint="Les 11 caractères après « v= » dans l'adresse YouTube. Laissez vide si la vidéo n'est pas en ligne."
                error={e.videoId}
              />
              <TextArea name="excerpts" label="Extraits clés" rows={4} defaultValue={v.excerpts} hint="Un extrait par ligne." error={e.excerpts} />
            </Section>
          ) : null}

          {format === "court" ? (
            <Section title="Format court">
              <TextArea name="quoteText" label="Citation commentée" rows={3} defaultValue={v.quoteText} hint="Une citation ou une vidéo verticale (ou les deux)." error={e.quoteText} />
              <TextField name="quoteAuthor" label="Auteur de la citation" defaultValue={v.quoteAuthor} error={e.quoteAuthor} />
              <TextField name="videoId" label="Vidéo verticale YouTube (identifiant)" defaultValue={v.videoId} error={e.videoId} />
              <SelectField
                name="deepDiveSlug"
                label="Contenu approfondi (lien « Pour aller plus loin »)"
                defaultValue={v.deepDiveSlug}
                options={[{ value: "", label: "Aucun" }, ...deepDiveOptions]}
                error={e.deepDiveSlug}
              />
            </Section>
          ) : null}

          <Section title="Texte">
            <TextArea
              name="body"
              label="Corps du contenu"
              required
              rows={18}
              defaultValue={v.body}
              hint={<BodyHelp />}
              error={e.body}
              className="font-mono"
            />
          </Section>

          <Section title="Sources et mots-clés">
            <TextArea
              name="sources"
              label="Sources"
              required
              rows={4}
              defaultValue={v.sources}
              hint="Une source par ligne. Pour ajouter un lien : Libellé | https://adresse"
              error={e.sources}
            />
            <TextField name="tags" label="Mots-clés" defaultValue={v.tags} hint="Séparés par des virgules." error={e.tags} />
            {can.markSponsored ? (
              <TextField
                name="sponsoredBy"
                label="Contenu sponsorisé : nom du partenaire"
                defaultValue={v.sponsoredBy}
                hint="Laissez vide pour un contenu éditorial. Rempli, la mention « Contenu sponsorisé » s'affiche en haut de l'article."
                error={e.sponsoredBy}
              />
            ) : null}
          </Section>

          {published ? (
            <Section title="Correction">
              <TextArea
                name="correctionNote"
                label="Note de correction (publique)"
                rows={3}
                defaultValue=""
                hint="Si vous corrigez une erreur, décrivez-la : la note s'ajoute au journal des corrections visible sous l'article."
                error={e.correctionNote}
              />
            </Section>
          ) : null}
        </fieldset>

        {/* Panneau de validation */}
        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start" aria-label="Statut et validation">
          <div className="border-2 border-violet p-5">
            <p className="type-label">Statut</p>
            <div className="mt-2">
              <StatusBadge status={status} />
            </div>
            <WorkflowSteps status={status} />

            <div className="mt-5 space-y-3">
              {can.edit ? (
                <div className="hidden lg:block">
                  <Button type="submit" name="intent" value="save" disabled={pending} className="w-full">
                    {pending ? "Enregistrement…" : isNew ? "Créer le brouillon" : "Enregistrer"}
                  </Button>
                </div>
              ) : null}
              {can.submit && !isNew ? intentButton("submit", "Envoyer en relecture") : null}

              {can.approve ? (
                <div className="space-y-3 border-t border-mauve pt-4">
                  <label className="flex gap-3 text-[0.9375rem] leading-6">
                    <input type="checkbox" name="factsChecked" className="mt-1 h-5 w-5 shrink-0 accent-bordeaux" aria-invalid={e.factsChecked ? true : undefined} />
                    J&apos;ai vérifié les faits, les sources et les droits des images.
                  </label>
                  {e.factsChecked ? <p className="text-[0.9375rem] font-medium text-bordeaux">{e.factsChecked}</p> : null}
                  {intentButton("approve", "Valider le contenu")}
                </div>
              ) : null}

              {can.publish ? intentButton("publish", "Publier maintenant", "primary") : null}

              {can.requestChanges ? (
                <div className="space-y-3 border-t border-mauve pt-4">
                  <TextArea name="reviewNote" label="Remarques pour l'auteur" rows={3} defaultValue="" error={e.reviewNote} />
                  {intentButton("request_changes", "Demander des modifications")}
                </div>
              ) : null}

              {can.unpublish ? (
                <div className="border-t border-mauve pt-4">{intentButton("unpublish", "Retirer du site")}</div>
              ) : null}

              {publicHref ? (
                <Link href={publicHref} target="_blank" rel="noopener" className={buttonClasses("secondary", "w-full")}>
                  Voir en ligne <span className="sr-only">(nouvel onglet)</span>
                </Link>
              ) : null}
            </div>
          </div>

          {history ? (
            <section aria-labelledby="historique" className="border border-mauve p-5">
              <h2 id="historique" className="type-label">
                Historique
              </h2>
              <div className="mt-3">{history}</div>
            </section>
          ) : null}
        </aside>
      </div>

      {/* Barre d'enregistrement fixe sur mobile */}
      {can.edit ? (
        <div className="fixed inset-x-0 bottom-0 z-10 border-t-2 border-violet bg-blanc px-4 py-3 lg:hidden">
          <Button type="submit" name="intent" value="save" disabled={pending} className="w-full">
            {pending ? "Enregistrement…" : isNew ? "Créer le brouillon" : dirty ? "Enregistrer les modifications" : "Enregistrer"}
          </Button>
        </div>
      ) : null}
    </form>
    {/* Hors du formulaire principal : pas de formulaires imbriqués */}
    {dangerZone ? <div className="mt-6 lg:ml-auto lg:w-80">{dangerZone}</div> : null}
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-6">
      <h2 className="type-h3 border-t-2 border-violet pt-4">{title}</h2>
      {children}
    </section>
  );
}

function WorkflowSteps({ status }: { status: ContentStatus }) {
  const steps: ContentStatus[] = ["draft", "review", "approved", "published"];
  const current = steps.indexOf(status);
  return (
    <ol className="mt-4 space-y-1 text-[0.9375rem]">
      {steps.map((s, i) => (
        <li key={s} aria-current={i === current ? "step" : undefined} className={`flex items-center gap-2 ${i === current ? "font-bold" : i < current ? "" : "text-violet/70"}`}>
          <span aria-hidden="true" className={`h-3 w-3 shrink-0 ${i <= current ? "bg-bordeaux" : "border-2 border-mauve"}`} />
          {i + 1}. {STATUS_LABELS[s]}
        </li>
      ))}
    </ol>
  );
}

function BodyHelp() {
  return (
    <details className="mt-1">
      <summary className="cursor-pointer font-bold">Mise en forme : aide-mémoire</summary>
      <ul className="mt-2 space-y-1">
        <li>Laissez une ligne vide entre deux paragraphes.</li>
        <li>
          <code>## Intertitre</code> · <code>### Sous-titre</code>
        </li>
        <li>
          <code>&gt; Citation</code> puis, à la ligne, <code>&gt; — Auteur</code>
        </li>
        <li>
          <code>!! À retenir</code> puis une ligne par point : <code>- point</code>
        </li>
      </ul>
    </details>
  );
}
