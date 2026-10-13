import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/container";
import { ContentForm } from "@/features/admin/content-form";
import { recordToValues } from "@/features/admin/content-values";
import { DeleteContentForm } from "@/features/admin/delete-content-form";
import { getContentForUser, listDeepDiveOptions } from "@/features/admin/queries";
import { AccessDenied, AdminPageSkeleton, HistoryList } from "@/features/admin/ui";
import { requireUser } from "@/lib/auth/current-user";
import { can } from "@/lib/auth/roles";
import { FORMATS } from "@/lib/rubriques";

export const metadata: Metadata = { title: "Modifier un contenu" };

type Props = PageProps<"/admin/contenus/[id]">;

export default function EditContentPage({ params, searchParams }: Props) {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <EditContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function EditContent({ params, searchParams }: Props) {
  const user = await requireUser();
  const { id } = await params;
  const sp = await searchParams;
  const result = await getContentForUser(user, id);

  if (result.state === "not-found") notFound();
  if (result.state === "forbidden") {
    return <AccessDenied message="Ce contenu appartient à un autre membre de la rédaction." />;
  }

  const { record } = result;
  return (
    <Container className="py-8">
      <Breadcrumb
        items={[
          { label: "Contenus", href: "/admin" },
          { label: record.title || "Sans titre", href: `/admin/contenus/${record.id}` },
        ]}
      />
      <p className="type-label mt-4">{FORMATS[record.format].label}</p>
      <h1 className="type-h1 mt-1">{record.title || "Sans titre"}</h1>

      <div className="mt-6">
        <ContentForm
          id={record.id}
          status={record.status}
          initialValues={recordToValues(record)}
          reviewNote={record.reviewNote}
          publicHref={record.status === "published" ? `/mag/${record.rubrique}/${record.slug}` : undefined}
          deepDiveOptions={(await listDeepDiveOptions()).filter((o) => o.value !== record.slug)}
          notice={sp.cree ? "Brouillon créé. Complétez-le, puis envoyez-le en relecture." : undefined}
          permissions={{
            edit: can.edit(user, record),
            submit: can.submit(user, record),
            requestChanges: can.requestChanges(user, record),
            approve: can.approve(user, record),
            publish: can.publish(user, record),
            unpublish: can.unpublish(user, record),
            chooseAuthor: can.chooseAuthor(user),
            markSponsored: can.markSponsored(user),
          }}
          history={<HistoryList history={record.history} />}
          dangerZone={can.remove(user, record) ? <DeleteContentForm id={record.id} title={record.title} /> : undefined}
        />
      </div>
    </Container>
  );
}
