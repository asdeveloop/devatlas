import { Badge, Card, Container, Grid, Section, Stack } from "@devatlas/ui";

type PlatformOverviewProps = {
  guideCount: number;
  toolCount: number;
};

export function PlatformOverview({
  guideCount,
  toolCount
}: PlatformOverviewProps): React.JSX.Element {
  return (
    <Section spacing="lg">
      <Container>
        <Stack gap="lg">
          <div>
            <Badge variant="secondary">Phase 2</Badge>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground">DevAtlas</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Frontend architecture is now organized around reusable components, feature modules,
              and shared platform utilities.
            </p>
          </div>
          <Grid columns={2} gap="lg">
            <Card className="border-border/80 bg-card p-6">
              <p className="text-sm font-medium text-muted-foreground">Guides seed</p>
              <p className="mt-2 text-3xl font-semibold text-card-foreground">{guideCount}</p>
            </Card>
            <Card className="border-border/80 bg-card p-6">
              <p className="text-sm font-medium text-muted-foreground">Tools seed</p>
              <p className="mt-2 text-3xl font-semibold text-card-foreground">{toolCount}</p>
            </Card>
          </Grid>
        </Stack>
      </Container>
    </Section>
  );
}
