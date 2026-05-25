import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditorialBoardPage() {
  const board = {
    chiefEditor: {
      name: "Dr. Editorial Name",
      affiliation: "University Name",
      email: "editor@researchverse.in",
    },
    managingEditors: [
      {
        name: "Dr. Managing Editor 1",
        affiliation: "Institution Name",
      },
      {
        name: "Dr. Managing Editor 2",
        affiliation: "Institution Name",
      },
    ],
    editorialBoard: [
      { name: "Dr. Member 1", affiliation: "University of Example" },
      { name: "Dr. Member 2", affiliation: "Institute of Research" },
      { name: "Dr. Member 3", affiliation: "College of Sciences" },
      { name: "Dr. Member 4", affiliation: "Technical Institute" },
      { name: "Dr. Member 5", affiliation: "Research Center" },
    ],
  };

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Editorial Board</h1>

      <div className="prose max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Chief Editor</h2>
          <Card>
            <CardHeader>
              <CardTitle>{board.chiefEditor.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{board.chiefEditor.affiliation}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {board.chiefEditor.email}
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Managing Editors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {board.managingEditors.map((editor, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>{editor.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{editor.affiliation}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Editorial Board Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {board.editorialBoard.map((member, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.affiliation}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}