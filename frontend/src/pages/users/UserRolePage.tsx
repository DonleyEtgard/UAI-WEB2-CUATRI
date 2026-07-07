import { useEffect, useState } from "react";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Box, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, CircularProgress, Typography } from "@mui/material";


interface User {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  role: "superadmin" | "admin" | "employee";
}

const UserRolePage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const { user: currentUser } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await API.get("/users");
        const fetchedUsers = res.data?.data?.users || [];
        setUsers(fetchedUsers);
      } catch (err) {
        console.error(t("users.roles.loadError"), err);
        alert(t("users.roles.loadUsersError"));
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleRoleChange = (userId: string, newRole: User['role']) => {
    setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
  };

  const handleSaveRole = async (userId: string) => {
    const userToUpdate = users.find(u => u._id === userId);
    if (!userToUpdate) return;

    setSavingId(userId);
    try {
      await API.patch(`/users/${userId}`, { role: userToUpdate.role });
      alert(t("users.roles.updated", { name: userToUpdate.name }));
    } catch (err) {
      console.error(err);
      alert(t("users.roles.saveError"));
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return <p className="p-10 text-center text-zinc-400">{t("users.roles.loading")}</p>;
  }

  return (
    <Box className="p-4 md:p-6 animate-in fade-in">
      <Box className="max-w-4xl mx-auto">
        <Box className="mb-8">
          <Typography variant="h4" component="h1" className="font-bold text-white">{t("users.roles.title")}</Typography>
          <Typography className="text-sm text-zinc-400 mt-1">
            {t("users.roles.subtitle")}
          </Typography>
        </Box>

        <Card className="bg-[#1c1c21] border border-[#2b2d31] rounded-xl overflow-hidden">
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead className="bg-zinc-900/50">
                  <TableRow>
                    <TableCell className="text-zinc-400 border-b border-zinc-700">{t("users.roles.user")}</TableCell>
                    <TableCell className="text-zinc-400 border-b border-zinc-700" sx={{ width: 200 }}>{t("users.roles.role")}</TableCell>
                    <TableCell className="text-zinc-400 border-b border-zinc-700" align="right" sx={{ width: 120 }}>{t("users.roles.action")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id} className="hover:bg-zinc-800/20">
                      <TableCell className="border-b border-zinc-800">
                        <Typography className="font-medium text-white">{user.name} {user.lastName}</Typography>
                        <Typography variant="caption" className="text-zinc-500">{user.email}</Typography>
                      </TableCell>
                      <TableCell className="border-b border-zinc-800">
                        <Select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value as User['role'])}
                          size="small"
                          fullWidth
                          disabled={user.role === 'superadmin' || savingId === user._id}
                          sx={{
                            color: 'white',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#4a4d54' },
                            '& .MuiSvgIcon-root': { color: 'white' }
                          }}
                        >
                          <MenuItem value="employee">{t("users.roles.employee")}</MenuItem>
                          <MenuItem value="client">{t("users.roles.client")}</MenuItem>
                          {currentUser?.role === "superadmin" && (
                            <MenuItem value="admin">{t("users.roles.admin")}</MenuItem>
                          )}
                          {user.role === 'superadmin' && (
                             <MenuItem value="superadmin">{t("users.roles.superadmin")}</MenuItem>
                          )}
                        </Select>
                      </TableCell>
                      <TableCell className="border-b border-zinc-800" align="right">
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleSaveRole(user._id)}
                          disabled={user.role === 'superadmin' || savingId === user._id}
                          sx={{ textTransform: 'none', fontWeight: 'bold' }}
                        >
                          {savingId === user._id ? <CircularProgress size={20} color="inherit" /> : t("users.roles.save")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default UserRolePage;