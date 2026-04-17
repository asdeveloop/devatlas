import { Container, Navbar } from "@devatlas/ui";

export function SiteHeader(): React.JSX.Element {
  return (
    <Navbar>
      <Container className="flex items-center justify-between py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            DevAtlas Platform
          </p>
          <p className="text-sm font-medium text-foreground">Engineering foundation</p>
        </div>
      </Container>
    </Navbar>
  );
}
