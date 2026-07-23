import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'
import { useAuthStore } from '@/stores/auth-store'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const user = useAuthStore((state) => state.auth.user)
  const userRole = user?.role?.[0] || 'Rescuer'

  // Define route whitelist per role
  const getAllowedRoutes = (role: string): string[] => {
    switch (role) {
      case 'Admin':
        return ['/', '/incident-reports', '/rescue-cases', '/animals', '/rescuers', '/shelters', '/treatments', '/reports', '/audit-logs', '/settings']
      case 'Dispatcher':
        return ['/', '/incident-reports', '/rescue-cases', '/animals', '/rescuers', '/shelters', '/settings']
      case 'Veterinarian':
        return ['/', '/incident-reports', '/rescue-cases', '/animals', '/rescuers', '/shelters', '/treatments', '/settings']
      case 'Rescuer':
        return ['/', '/incident-reports', '/rescue-cases', '/animals', '/rescuers', '/shelters', '/settings']
      case 'Shelter Staff':
        return ['/', '/incident-reports', '/rescue-cases', '/animals', '/rescuers', '/shelters', '/settings']
      case 'Viewer':
      default:
        return ['/', '/reports', '/settings']
    }
  }

  const allowedRoutes = getAllowedRoutes(userRole)

  // Filter groups and items
  const filteredNavGroups = sidebarData.navGroups
    .map((group) => {
      const filteredItems = group.items.filter((item) => allowedRoutes.includes(item.url))
      return { ...group, items: filteredItems }
    })
    .filter((group) => group.items.length > 0)

  // Dynamic user header mapping
  const activeUser = user
    ? {
        name: user.email.split('@')[0].toUpperCase(),
        email: user.email,
        avatar: userRole === 'Admin' ? '/images/admin-avatar.jpg' : '/images/rescuer-avatar.jpg',
      }
    : sidebarData.user

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {filteredNavGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={activeUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
