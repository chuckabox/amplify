import { INITIAL_OPERATORS } from "@/lib/data/operators";
import ClientPage from "./client-page";

export function generateStaticParams() {
  return INITIAL_OPERATORS.flatMap((op) =>
    op.audits.map((a) => ({ id: a.id }))
  );
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ClientPage params={params} />;
}
