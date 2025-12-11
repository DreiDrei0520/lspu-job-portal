import { Bell, User, LogOut, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase-client'
import { api } from '../utils/api'
import lspuLogo from 'figma:asset/632e126b3f1d7e670d648c8751062fdf02606f8b.png'

interface NavbarProps {
  user?: any
  onLogout: () => void
}

export function Navbar({ user, onLogout }: NavbarProps) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    if (user) {
      loadNotifications()
      loadProfile()
    }
  }, [user])

  const loadNotifications = async () => {
    try {
      const { notifications } = await api.getNotifications()
      setNotifications(notifications || [])
    } catch (error) {
      console.error('Failed to load notifications:', error)
    }
  }

  const loadProfile = async () => {
    try {
      const { profile } = await api.getProfile()
      setProfile(profile)
    } catch (error) {
      console.error('Failed to load profile:', error)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id)
      loadNotifications()
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <img src={lspuLogo} alt="LSPU Logo" className="w-12 h-12 object-contain" />
            <div>
              <div className="text-[#116d8a]">LSPU-LBC</div>
              <div className="text-xs text-gray-600">Job Portal</div>
            </div>
          </div>

          {user && (
            <>
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-4">
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Bell className="w-5 h-5 text-gray-600" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border max-h-96 overflow-y-auto">
                      <div className="p-3 border-b">
                        <h3>Notifications</h3>
                      </div>
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No notifications
                        </div>
                      ) : (
                        <div className="divide-y">
                          {notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-3 hover:bg-gray-50 cursor-pointer ${
                                !notif.read ? 'bg-[#e0f2f7]' : ''
                              }`}
                              onClick={() => handleMarkAsRead(notif.id)}
                            >
                              <div className="text-sm">{notif.message}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(notif.createdAt).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm">{profile?.name || user.email}</div>
                    <div className="text-xs text-gray-500 capitalize">
                      {profile?.role || 'User'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {showMobileMenu ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {user && showMobileMenu && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 px-3 py-2 bg-gray-100 rounded-lg">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#e0f2f7] border-2 border-white shadow-sm flex-shrink-0">
                  {profile?.profilePictureUrl ? (
                    <img
                      src={profile.profilePictureUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-6 h-6 text-[#116d8a]" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm">{profile?.name || user.email}</div>
                  <div className="text-xs text-gray-500 capitalize">
                    {profile?.role || 'User'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowNotifications(!showNotifications)
                  setShowMobileMenu(false)
                }}
                className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 rounded-lg"
              >
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-red-600"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
