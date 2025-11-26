import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Loader2,
  AlertTriangle,
  Search,
  Users,
  Activity,
  Target,
  Keyboard
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

interface TestResult {
  id: string;
  created_at: string;
  test_type: string;
  difficulty: string;
  wpm: number;
  accuracy: number;
  errors_count: number;
  duration_seconds: number;
  profiles: {
    full_name: string;
    email: string;
    matricula: string;
    cpf: string;
  } | null;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("typing_test_results")
        .select(`
          *,
          profiles (
            full_name,
            email,
            matricula,
            cpf
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setResults(data || []);
    } catch (err: any) {
      console.error("Error fetching results:", err);
      setError(`Erro ao carregar resultados: ${err.message || err.error_description || "Verifique suas permissões."}`);
    } finally {
      setLoading(false);
    }
  };

  // Filtered Results
  const filteredResults = useMemo(() => {
    return results.filter((result) => {
      const matchesSearch =
        result.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.profiles?.matricula?.includes(searchTerm) ||
        result.profiles?.cpf?.includes(searchTerm) ||
        result.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === "all" || result.test_type === typeFilter;
      const matchesDifficulty = difficultyFilter === "all" || result.difficulty === difficultyFilter;

      return matchesSearch && matchesType && matchesDifficulty;
    });
  }, [results, searchTerm, typeFilter, difficultyFilter]);

  // Statistics
  const stats = useMemo(() => {
    const totalTests = filteredResults.length;
    const uniqueUsers = new Set(filteredResults.map(r => r.profiles?.email)).size;
    const avgWpm = totalTests > 0
      ? Math.round(filteredResults.reduce((acc, curr) => acc + curr.wpm, 0) / totalTests)
      : 0;
    const avgAccuracy = totalTests > 0
      ? Math.round(filteredResults.reduce((acc, curr) => acc + curr.accuracy, 0) / totalTests)
      : 0;

    return { totalTests, uniqueUsers, avgWpm, avgAccuracy };
  }, [filteredResults]);

  // Chart Data
  const difficultyData = useMemo(() => {
    const counts = { facil: 0, medio: 0, dificil: 0 };
    filteredResults.forEach(r => {
      if (r.difficulty in counts) counts[r.difficulty as keyof typeof counts]++;
    });
    return [
      { name: 'Fácil', value: counts.facil },
      { name: 'Médio', value: counts.medio },
      { name: 'Difícil', value: counts.dificil },
    ];
  }, [filteredResults]);

  const typeData = useMemo(() => {
    const counts = { texto: 0, audio: 0 };
    filteredResults.forEach(r => {
      if (r.test_type in counts) counts[r.test_type as keyof typeof counts]++;
    });
    return [
      { name: 'Texto', value: counts.texto },
      { name: 'Áudio', value: counts.audio },
    ];
  }, [filteredResults]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "facil": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "medio": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "dificil": return "bg-red-100 text-red-800 hover:bg-red-100";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex flex-col gap-8">

          {/* Header Section */}
          <div>
            <h1 className="text-3xl font-bold text-cobalto">Painel Administrativo</h1>
            <p className="text-muted-foreground">Visão geral do desempenho dos colaboradores</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Testes</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTests}</div>
                <p className="text-xs text-muted-foreground">testes realizados</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Colaboradores</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
                <p className="text-xs text-muted-foreground">usuários únicos</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Média WPM</CardTitle>
                <Keyboard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgWpm}</div>
                <p className="text-xs text-muted-foreground">palavras por minuto</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Precisão Média</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgAccuracy}%</div>
                <p className="text-xs text-muted-foreground">de acerto</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Distribuição por Dificuldade</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={difficultyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Tipos de Teste</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Table Section */}
          <Card>
            <CardHeader>
              <CardTitle>Resultados Detalhados</CardTitle>
              <CardDescription>
                Visualize e filtre os resultados individuais.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters Toolbar */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome, matrícula ou email..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipo de Teste" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    <SelectItem value="texto">Texto</SelectItem>
                    <SelectItem value="audio">Áudio</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Dificuldade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Dificuldades</SelectItem>
                    <SelectItem value="facil">Fácil</SelectItem>
                    <SelectItem value="medio">Médio</SelectItem>
                    <SelectItem value="dificil">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Colaborador</TableHead>
                      <TableHead>Identificação</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Dificuldade</TableHead>
                      <TableHead>WPM</TableHead>
                      <TableHead>Precisão</TableHead>
                      <TableHead>Erros</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          Nenhum resultado encontrado para os filtros selecionados.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredResults.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell className="whitespace-nowrap">
                            {format(new Date(result.created_at), "dd/MM/yyyy HH:mm", {
                              locale: ptBR,
                            })}
                          </TableCell>
                          <TableCell className="font-medium">
                            {result.profiles?.full_name || "N/A"}
                            <div className="text-xs text-muted-foreground">
                              {result.profiles?.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            {result.profiles?.matricula ? (
                              <div>
                                <span className="text-xs font-semibold text-muted-foreground">Matrícula:</span>
                                <div className="font-mono">{result.profiles.matricula}</div>
                              </div>
                            ) : (
                              <div>
                                <span className="text-xs font-semibold text-muted-foreground">CPF:</span>
                                <div className="font-mono">{result.profiles?.cpf || "N/A"}</div>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="capitalize">
                            {result.test_type === 'texto' ? (
                              <Badge variant="outline">Texto</Badge>
                            ) : (
                              <Badge variant="outline">Áudio</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={getDifficultyColor(result.difficulty)}
                            >
                              {result.difficulty}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold">{result.wpm}</TableCell>
                          <TableCell>
                            <span className={result.accuracy >= 90 ? "text-green-600 font-medium" : "text-red-600"}>
                              {result.accuracy}%
                            </span>
                          </TableCell>
                          <TableCell>{result.errors_count}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
