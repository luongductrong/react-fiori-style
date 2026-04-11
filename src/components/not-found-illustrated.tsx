import '@ui5/webcomponents-icons/nav-back.js';
import { useNavigate, Link } from 'react-router';
import { Button } from '@ui5/webcomponents-react/Button';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { ObjectPage } from '@ui5/webcomponents-react/ObjectPage';
import { Breadcrumbs } from '@ui5/webcomponents-react/Breadcrumbs';
import '@ui5/webcomponents-fiori/dist/illustrations/PageNotFound.js';
import { BreadcrumbsItem } from '@ui5/webcomponents-react/BreadcrumbsItem';
import { ObjectPageTitle } from '@ui5/webcomponents-react/ObjectPageTitle';
import { IllustratedMessage } from '@ui5/webcomponents-react/IllustratedMessage';

interface NotFoundIllustratedProps {
  title?: string;
  subtitle?: string;
  breadcrumbText?: string;
  breadcrumbRoute?: string;
}

export function NotFoundIllustrated({ title, subtitle, breadcrumbText, breadcrumbRoute }: NotFoundIllustratedProps) {
  const navigate = useNavigate();
  return (
    <ObjectPage
      mode="Default"
      hidePinButton={true}
      titleArea={
        <ObjectPageTitle
          breadcrumbs={
            breadcrumbText && breadcrumbRoute ? (
              <Breadcrumbs
                onItemClick={(e) => {
                  const route = e.detail.item.dataset.route;
                  if (route) {
                    navigate(route);
                  }
                }}
              >
                <BreadcrumbsItem data-route={breadcrumbRoute}>{breadcrumbText}</BreadcrumbsItem>
                <BreadcrumbsItem>Not Found</BreadcrumbsItem>
              </Breadcrumbs>
            ) : null
          }
        />
      }
    >
      <IllustratedMessage
        name="PageNotFound"
        titleText={title || 'Page Not Found'}
        subtitleText={subtitle || 'We couldn’t find the page you’re looking for.'}
        className="bg-background"
      >
        <FlexBox direction="Column" justifyContent="Center" alignItems="Center">
          <Button design="Transparent" icon="nav-back" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Link to="/shell-home">
            <Button design="Transparent">Back to Home page</Button>
          </Link>
        </FlexBox>
      </IllustratedMessage>
    </ObjectPage>
  );
}
