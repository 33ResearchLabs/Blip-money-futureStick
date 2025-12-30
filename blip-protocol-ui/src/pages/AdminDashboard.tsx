import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { airdropApi } from "@/services/Airdrop";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Users, Clock, Award, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Task {
  _id: string;
  task_type: string;
  status: string;
  proof_data?: {
    post_url?: string;
    screenshot_url?: string;
    text_proof?: string;
  };
  createdAt: string;
  user_id: {
    _id: string;
    wallet_address: string;
    email?: string;
    totalBlipPoints: number;
  };
}

interface Stats {
  totalUsers: number;
  pendingTasks: number;
  submittedTasks: number;
  verifiedTasks: number;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [stats, setStats] = useState<Stats | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("SUBMITTED");
  const [taskTypeFilter, setTaskTypeFilter] = useState<string>("");

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      navigate("/dashboard");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [statsRes, tasksRes] = await Promise.all([
        airdropApi.getAdminStats(),
        airdropApi.getAdminTasks(activeTab, taskTypeFilter || undefined),
      ]);
      setStats(statsRes.data.stats);
      setTasks(tasksRes.data.tasks);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (status: string, taskType?: string) => {
    try {
      const res = await airdropApi.getAdminTasks(status, taskType || undefined);
      setTasks(res.data.tasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    fetchTasks(value, taskTypeFilter || undefined);
  };

  const handleTaskTypeFilter = (taskType: string) => {
    setTaskTypeFilter(taskType);
    fetchTasks(activeTab, taskType || undefined);
  };

  const handleVerify = async (taskId: string) => {
    try {
      await airdropApi.verifyTask(taskId);
      toast({
        title: "Success",
        description: "Task verified and points credited",
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify task",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (taskId: string) => {
    try {
      await airdropApi.rejectTask(taskId);
      toast({
        title: "Task Rejected",
        description: "Task has been rejected",
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject task",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/airdrop");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateWallet = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-blue-400">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">{user?.wallet_address && truncateWallet(user.wallet_address)}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats?.totalUsers || 0}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Pending Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-400">{stats?.pendingTasks || 0}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400" />
                Awaiting Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-400">{stats?.submittedTasks || 0}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <Award className="w-4 h-4 text-green-400" />
                Verified Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-400">{stats?.verifiedTasks || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Task Type Filter */}
        <div className="mb-4 flex gap-2">
          <Button
            variant={taskTypeFilter === "" ? "default" : "outline"}
            size="sm"
            onClick={() => handleTaskTypeFilter("")}
          >
            All
          </Button>
          <Button
            variant={taskTypeFilter === "TWITTER" ? "default" : "outline"}
            size="sm"
            onClick={() => handleTaskTypeFilter("TWITTER")}
          >
            Twitter
          </Button>
          <Button
            variant={taskTypeFilter === "TELEGRAM" ? "default" : "outline"}
            size="sm"
            onClick={() => handleTaskTypeFilter("TELEGRAM")}
          >
            Telegram
          </Button>
          <Button
            variant={taskTypeFilter === "WHITEPAPER" ? "default" : "outline"}
            size="sm"
            onClick={() => handleTaskTypeFilter("WHITEPAPER")}
          >
            Whitepaper
          </Button>
        </div>

        {/* Tasks Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="bg-gray-800 mb-4">
            <TabsTrigger value="SUBMITTED">Awaiting Verification</TabsTrigger>
            <TabsTrigger value="VERIFIED">Verified</TabsTrigger>
            <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
            <TabsTrigger value="PENDING">Pending</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="py-8 text-center text-gray-400">
                    No tasks found
                  </CardContent>
                </Card>
              ) : (
                tasks.map((task) => (
                  <Card key={task._id} className="bg-gray-800 border-gray-700">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge
                              variant={
                                task.task_type === "TWITTER"
                                  ? "default"
                                  : task.task_type === "TELEGRAM"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {task.task_type}
                            </Badge>
                            <Badge
                              variant={
                                task.status === "VERIFIED"
                                  ? "default"
                                  : task.status === "REJECTED"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className={
                                task.status === "VERIFIED"
                                  ? "bg-green-600"
                                  : task.status === "SUBMITTED"
                                  ? "bg-orange-600"
                                  : ""
                              }
                            >
                              {task.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400">
                            User: {truncateWallet(task.user_id.wallet_address)}
                            {task.user_id.email && ` (${task.user_id.email})`}
                          </p>
                          <p className="text-xs text-gray-500">
                            Points: {task.user_id.totalBlipPoints} | Submitted: {formatDate(task.createdAt)}
                          </p>
                          {task.proof_data?.text_proof && (
                            <p className="text-xs text-gray-400 mt-2">
                              Proof: {task.proof_data.text_proof}
                            </p>
                          )}
                        </div>

                        {task.status === "SUBMITTED" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleVerify(task._id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Verify
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(task._id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
