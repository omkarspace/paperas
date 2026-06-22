"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Member {
  id: string
  name: string
  affiliation: string
  role: string
  bio: string | null
  order: number
}

export default function AdminEditorialBoardPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [name, setName] = useState("")
  const [affiliation, setAffiliation] = useState("")
  const [role, setRole] = useState("Editorial Board Member")
  const [bio, setBio] = useState("")
  const [message, setMessage] = useState("")

  function load() {
    fetch("/api/admin/editorial-board")
      .then((r) => r.json())
      .then((data) => {
        if (data.members) setMembers(data.members)
      })
  }

  useEffect(load, [])

  async function addMember(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/admin/editorial-board", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, affiliation, role, bio: bio || undefined }),
    })
    if (res.ok) {
      setMessage("Member added")
      setName(""); setAffiliation(""); setRole("Editorial Board Member"); setBio("")
      load()
    } else {
      const data = await res.json()
      setMessage(data.error || "Failed")
    }
  }

  async function removeMember(id: string) {
    await fetch(`/api/admin/editorial-board?id=${id}`, { method: "DELETE" })
    load()
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Editorial Board Management</h1>

      <Card>
        <CardHeader><CardTitle>Add Member</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={addMember} className="space-y-4">
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input placeholder="Affiliation" value={affiliation} onChange={(e) => setAffiliation(e.target.value)} required />
            <Input placeholder="Role (e.g. Editor-in-Chief)" value={role} onChange={(e) => setRole(e.target.value)} />
            <Textarea placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
            {message && <p className="text-sm text-muted-foreground">{message}</p>}
            <Button type="submit">Add</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {members.map((m) => (
          <Card key={m.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{m.name}</p>
                <p className="text-sm text-muted-foreground">{m.affiliation} — {m.role}</p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => removeMember(m.id)}>Remove</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
