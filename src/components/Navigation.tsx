import Link from 'next/link'

export const Navigation = () => {
  return (
    <div className="space-x-3 pointer-events-auto flex">
      <Link href={'/'} className="text-muted-foreground">
        Blob
      </Link>
      <Link href={'/sphere'} className="text-muted-foreground">
        Sphere
      </Link>
      <Link href={'/pyramid'} className="text-muted-foreground">
        Pyramind
      </Link>
      <Link href={'/octahedron'} className="text-muted-foreground">
        Octahedron
      </Link>
    </div>
  )
}
