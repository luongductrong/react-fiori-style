import { NotFoundIllustrated } from '@/components/not-found-illustrated';

export function NotFoundView() {
  return (
    <NotFoundIllustrated
      className="flex-1"
      title="Page Not Found"
      subtitle="We couldn't find the page you're looking for."
      breadcrumbText="Home"
      breadcrumbRoute="/launchpad"
    />
  );
}
