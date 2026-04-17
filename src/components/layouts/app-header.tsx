import * as React from 'react';
import { ODATA_BASE_URL } from '@/app-env';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { ODATA_PUBLIC_SERVICE } from '@/app-constant';
import { Avatar } from '@ui5/webcomponents-react/Avatar';
import { UserMenuAccount } from '@ui5/webcomponents-react/UserMenuAccount';
import { UserMenu, type UserMenuDomRef } from '@ui5/webcomponents-react/UserMenu';
import { ShellBar, type ShellBarPropTypes } from '@ui5/webcomponents-react/ShellBar';
import { currentPublicUserProfileQueryOptions } from '@/features/auth-users/options/query';

interface AppHeaderProps {
  primaryTitle?: string;
  secondaryTitle?: string;
  username?: string | null;
}

const SAP_LOGO_URL = 'https://ui5.github.io/webcomponents/images/sap-logo-svg.svg';

function getAvatarInitials(username: string) {
  const tokens = username.trim().split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return 'U';
  }

  if (tokens.length === 1) {
    return tokens[0].slice(0, 1).toUpperCase();
  }

  return `${tokens[0][0] ?? ''}${tokens.at(-1)?.[0] ?? ''}`.toUpperCase();
}

function logout() {
  window.location.replace(
    `${ODATA_BASE_URL}${ODATA_PUBLIC_SERVICE.LOG_OUT_ACTION}?sap-client=${ODATA_PUBLIC_SERVICE.SAP_CLIENT}`,
  );
}

export function AppHeader({ primaryTitle = 'Corporate Portal', secondaryTitle, username }: AppHeaderProps) {
  const navigate = useNavigate();
  const headerRef = React.useRef<HTMLDivElement>(null);
  const userMenuRef = React.useRef<UserMenuDomRef>(null);
  const [headerHeight, setHeaderHeight] = React.useState(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const { data: publicUserProfile } = useQuery(currentPublicUserProfileQueryOptions());

  const displayName =
    [publicUserProfile?.FirstName, publicUserProfile?.LastName].filter(Boolean).join(' ').trim() ||
    publicUserProfile?.Name?.trim() ||
    publicUserProfile?.Id?.trim() ||
    username?.trim() ||
    'Current User';
  const accountSubtitle = publicUserProfile?.Id?.trim() || username?.trim() || 'Current User';
  const avatarInitials = React.useMemo(() => getAvatarInitials(displayName), [displayName]);

  React.useLayoutEffect(() => {
    const headerElement = headerRef.current;

    if (!headerElement) {
      return;
    }

    const updateHeaderHeight = () => {
      setHeaderHeight(Math.ceil(headerElement.getBoundingClientRect().height));
    };

    updateHeaderHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeaderHeight();
    });

    resizeObserver.observe(headerElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleProfileClick: NonNullable<ShellBarPropTypes['onProfileClick']> = (event) => {
    if (userMenuRef.current) {
      userMenuRef.current.opener = event.detail.targetRef;
    }

    setIsUserMenuOpen(true);
  };

  const handleSignOut = () => {
    setIsUserMenuOpen(false);
    logout();
  };

  return (
    <>
      <div
        aria-hidden="true"
        className="w-full shrink-0"
        style={{ height: headerHeight > 0 ? `${headerHeight}px` : undefined }}
      />
      <div ref={headerRef} className="fixed inset-x-0 top-0 z-40">
        <ShellBar
          className="px-8"
          onLogoClick={() => {
            navigate('/launchpad');
          }}
          accessibilityAttributes={{
            profile: {
              expanded: isUserMenuOpen ? 'true' : 'false',
              hasPopup: 'menu',
              name: `${displayName} menu`,
            },
          }}
          logo={<img alt="SAP Logo" className="h-7 w-auto" src={SAP_LOGO_URL} />}
          onProfileClick={handleProfileClick}
          primaryTitle={primaryTitle}
          profile={<Avatar accessibleName={`${displayName} profile`} initials={avatarInitials} />}
          secondaryTitle={secondaryTitle}
        />
      </div>
      <UserMenu
        ref={userMenuRef}
        accounts={
          <UserMenuAccount avatarInitials={avatarInitials} subtitleText={accountSubtitle} titleText={displayName} />
        }
        onClose={() => {
          setIsUserMenuOpen(false);
        }}
        onSignOutClick={handleSignOut}
        open={isUserMenuOpen}
      />
    </>
  );
}
