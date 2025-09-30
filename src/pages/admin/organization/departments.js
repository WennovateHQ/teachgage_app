import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Users, 
  BookOpen, 
  Settings,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Shield
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([])
  const [filteredDepartments, setFilteredDepartments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    // Simulate API call to fetch departments
    const fetchDepartments = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockDepartments = [
          {
            id: 'dept_1',
            name: 'Computer Science',
            code: 'CS',
            description: 'Department of Computer Science and Engineering',
            adminId: 'user_1',
            adminName: 'Dr. Sarah Johnson',
            userCount: 45,
            courseCount: 12,
            activeEvaluations: 8,
            createdAt: '2023-09-01',
            settings: {
              allowSelfEnrollment: false,
              requireApproval: true,
              autoAssignSurveys: true
            },
            status: 'active'
          },
          {
            id: 'dept_2',
            name: 'Mathematics',
            code: 'MATH',
            description: 'Department of Mathematics and Statistics',
            adminId: 'user_2',
            adminName: 'Prof. Michael Chen',
            userCount: 32,
            courseCount: 15,
            activeEvaluations: 12,
            createdAt: '2023-09-01',
            settings: {
              allowSelfEnrollment: true,
              requireApproval: false,
              autoAssignSurveys: true
            },
            status: 'active'
          },
          {
            id: 'dept_3',
            name: 'Business Administration',
            code: 'BUS',
            description: 'School of Business Administration',
            adminId: 'user_3',
            adminName: 'Dr. Emily Rodriguez',
            userCount: 38,
            courseCount: 8,
            activeEvaluations: 5,
            createdAt: '2023-09-15',
            settings: {
              allowSelfEnrollment: false,
              requireApproval: true,
              autoAssignSurveys: false
            },
            status: 'active'
          },
          {
            id: 'dept_4',
            name: 'Physics',
            code: 'PHYS',
            description: 'Department of Physics and Astronomy',
            adminId: 'user_4',
            adminName: 'Dr. James Wilson',
            userCount: 28,
            courseCount: 10,
            activeEvaluations: 7,
            createdAt: '2023-10-01',
            settings: {
              allowSelfEnrollment: true,
              requireApproval: true,
              autoAssignSurveys: true
            },
            status: 'active'
          },
          {
            id: 'dept_5',
            name: 'English Literature',
            code: 'ENG',
            description: 'Department of English and Literature',
            adminId: 'user_5',
            adminName: 'Prof. Lisa Anderson',
            userCount: 22,
            courseCount: 18,
            activeEvaluations: 3,
            createdAt: '2023-08-20',
            settings: {
              allowSelfEnrollment: false,
              requireApproval: false,
              autoAssignSurveys: true
            },
            status: 'inactive'
          }
        ]
        
        setDepartments(mockDepartments)
        setFilteredDepartments(mockDepartments)
      } catch (error) {
        console.error('Error fetching departments:', error)
        toast.error('Failed to load departments')
      } finally {
        setLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  useEffect(() => {
    // Filter departments based on search
    let filtered = departments

    if (searchTerm) {
      filtered = filtered.filter(dept => 
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.adminName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredDepartments(filtered)
  }, [departments, searchTerm])

  const handleViewDepartment = (deptId) => {
    console.log('View department:', deptId)
  }

  const handleEditDepartment = (deptId) => {
    console.log('Edit department:', deptId)
  }

  const handleDeleteDepartment = (deptId) => {
    if (confirm('Are you sure you want to delete this department?')) {
      setDepartments(prev => prev.filter(dept => dept.id !== deptId))
      toast.success('Department deleted successfully')
    }
  }

  const handleManageUsers = (deptId) => {
    console.log('Manage users for department:', deptId)
  }

  if (loading) {
    return (
      <AdminLayout title="Department Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Department Management - TeachGage Admin</title>
        <meta name="description" content="Manage departments and their settings" />
      </Head>

      <AdminLayout title="Department Management">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent w-64"
              />
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Department
          </button>
        </div>

        {/* Departments Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evaluations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Settings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDepartments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {dept.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {dept.code} • {dept.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 text-blue-500 mr-2" />
                        <div className="text-sm text-gray-900">{dept.adminName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-900">{dept.userCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 text-purple-500 mr-2" />
                        <span className="text-sm text-gray-900">{dept.courseCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{dept.activeEvaluations}</span>
                      <span className="text-xs text-gray-500 ml-1">active</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          dept.settings.allowSelfEnrollment 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {dept.settings.allowSelfEnrollment ? 'Self Enroll' : 'No Self Enroll'}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          dept.settings.requireApproval 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {dept.settings.requireApproval ? 'Approval Req.' : 'Auto Approve'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        dept.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {dept.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewDepartment(dept.id)}
                          className="text-gray-400 hover:text-gray-600"
                          title="View Department"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleManageUsers(dept.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Manage Users"
                        >
                          <UserPlus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditDepartment(dept.id)}
                          className="text-teachgage-blue hover:text-teachgage-medium-blue"
                          title="Edit Department"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDepartment(dept.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Department"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredDepartments.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Try adjusting your search criteria'
                : 'Get started by creating your first department'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Department
              </button>
            )}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
                <p className="text-sm text-gray-600">Total Departments</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {departments.reduce((sum, dept) => sum + dept.userCount, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {departments.reduce((sum, dept) => sum + dept.courseCount, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Courses</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-orange-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {departments.reduce((sum, dept) => sum + dept.activeEvaluations, 0)}
                </p>
                <p className="text-sm text-gray-600">Active Evaluations</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
