import * as React from 'react';
import { ODATA_BASE_URL } from '@/app-env';
import { APP_LOCALE } from '@/app-constant';
import { toast } from '@/libs/helpers/toast';
import '@ui5/webcomponents-icons/refresh.js';
import '@ui5/webcomponents-icons/nav-back.js';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { useLocation, useNavigate } from 'react-router';
import { Avatar } from '@ui5/webcomponents-react/Avatar';
import { Button } from '@ui5/webcomponents-react/Button';
import { clearCsrfToken } from '@/libs/helpers/csrf-token';
import { UserMenuAccount } from '@ui5/webcomponents-react/UserMenuAccount';
import { UserMenu, type UserMenuDomRef } from '@ui5/webcomponents-react/UserMenu';
import { currentAuthUserQueryOptions } from '@/features/auth-users/options/query';
import { ShellBar, type ShellBarPropTypes } from '@ui5/webcomponents-react/ShellBar';
import { ODATA_PUBLIC_SERVICE, SAP_LOGO_URL, ODATA_SAP_CLIENT } from '@/app-constant';
import { currentPublicUserProfileQueryOptions } from '@/features/auth-users/options/query';
import { UserMenuItem, type UserMenuItemPropTypes } from '@ui5/webcomponents-react/UserMenuItem';

interface AppHeaderProps {
  primaryTitle?: string;
  secondaryTitle?: string;
  username?: string | null;
}

function getAvatarInitials(username: string) {
  const tokens = username.trim().split(/\s+/).filter(Boolean); // \s+ === whitespace

  if (tokens.length === 0) {
    return 'U';
  }

  if (tokens.length === 1) {
    return tokens[0].slice(0, 1).toUpperCase();
  }

  return `${tokens[0][0] ?? ''}${tokens.at(-1)?.[0] ?? ''}`.toUpperCase();
}

function logout() {
  window.location.replace(`${ODATA_BASE_URL}${ODATA_PUBLIC_SERVICE.LOG_OUT_ACTION}?sap-client=${ODATA_SAP_CLIENT}`);
}

export function AppHeader({ primaryTitle = 'Corporate Portal', secondaryTitle, username }: AppHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = React.useRef<HTMLDivElement>(null);
  const userMenuRef = React.useRef<UserMenuDomRef>(null);
  const [headerHeight, setHeaderHeight] = React.useState(0);
  const csrfToken = useAuthStore((state) => state.csrfToken);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const { data: authUser, refetch } = useQuery(currentAuthUserQueryOptions());
  const { data: publicUserProfile } = useQuery(currentPublicUserProfileQueryOptions());

  const displayName =
    [publicUserProfile?.FirstName, publicUserProfile?.LastName].filter(Boolean).join(' ').trim() ||
    publicUserProfile?.Name?.trim() ||
    publicUserProfile?.Id?.trim() ||
    username?.trim() ||
    'User';
  const accountSubtitle = publicUserProfile?.Id?.trim() || username?.trim() || '';
  const avatarInitials = React.useMemo(() => getAvatarInitials(displayName), [displayName]);
  const shouldShowBackButton = location.pathname !== '/launchpad';

  React.useLayoutEffect(() => {
    const headerElement = headerRef.current;

    if (!headerElement) {
      return;
    }

    const updateHeaderHeight = () => {
      const nextHeaderHeight = Math.ceil(headerElement.getBoundingClientRect().height);

      setHeaderHeight(nextHeaderHeight);
      document.documentElement.style.setProperty('--app-header-height', `${nextHeaderHeight}px`);
    };

    updateHeaderHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeaderHeight();
    });

    resizeObserver.observe(headerElement);

    return () => {
      resizeObserver.disconnect();
      document.documentElement.style.removeProperty('--app-header-height');
    };
  }, []);

  const handleProfileClick: NonNullable<ShellBarPropTypes['onProfileClick']> = (event) => {
    if (userMenuRef.current) {
      userMenuRef.current.opener = event.detail.targetRef;
    }

    setIsUserMenuOpen(true);
  };

  const handleSignOut = function () {
    logout();
  };

  const handleBack = function () {
    navigate(-1);
  };

  const handleLoadNewToken: UserMenuItemPropTypes['onClick'] = function () {
    clearCsrfToken();
    toast('Requested new token');
  };

  const handleRefreshAccountRoles: UserMenuItemPropTypes['onClick'] = function () {
    refetch();
    toast('Refreshed account roles');
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
          startButton={
            shouldShowBackButton ? (
              <Button
                accessibleName="Back"
                design="Transparent"
                className="text-primary"
                icon="nav-back"
                onClick={handleBack}
                tooltip="Back"
              />
            ) : undefined
          }
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
          logo={<img alt="SAP Logo" className="h-7 w-auto" src={`${ODATA_BASE_URL}${SAP_LOGO_URL}`} />}
          onProfileClick={handleProfileClick}
          primaryTitle={primaryTitle}
          profile={<Avatar accessibleName={`${displayName} profile`} initials={avatarInitials} />}
          secondaryTitle={secondaryTitle}
        />
      </div>
      <UserMenu
        ref={userMenuRef}
        accounts={
          <UserMenuAccount
            avatarInitials={avatarInitials}
            subtitleText={accountSubtitle || undefined}
            titleText={displayName + (authUser?.value[0]?.Role === 'ADMIN' ? ' (Administrator)' : '')}
            description={'Language: ' + APP_LOCALE}
          />
        }
        onClose={() => {
          setIsUserMenuOpen(false);
        }}
        onSignOutClick={handleSignOut}
        open={isUserMenuOpen}
      >
        {csrfToken && <UserMenuItem icon="refresh" text="Load new account token" onClick={handleLoadNewToken} />}
        <UserMenuItem icon="refresh" text="Refresh account roles" onClick={handleRefreshAccountRoles} />
      </UserMenu>
    </>
  );
}
