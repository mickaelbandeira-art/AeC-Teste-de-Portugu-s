export interface Participant {
    matricula: string;
    name: string;
    email: string;
}

export const participants: Participant[] = [
    { matricula: "123456", name: "João da Silva", email: "joao.silva@exemplo.com" },
    { matricula: "654321", name: "Maria Oliveira", email: "maria.oliveira@exemplo.com" },
    { matricula: "112233", name: "Carlos Pereira", email: "carlos.pereira@exemplo.com" },
    { matricula: "445566", name: "Ana Souza", email: "ana.souza@exemplo.com" },
    { matricula: "778899", name: "Pedro Santos", email: "pedro.santos@exemplo.com" },
];
