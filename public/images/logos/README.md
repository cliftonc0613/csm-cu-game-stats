# Team Logo Assets

This directory contains SVG logo files for Clemson and opponent teams.

## Available Logos

### Clemson
- **clemson.svg** - Clemson Tigers paw logo (Clemson Orange #F56600)

### ACC Opponents
- **florida-state.svg** - Florida State Seminoles (Garnet #782F40)
- **georgia.svg** - Georgia Bulldogs (Red #BA0C2F)
- **louisville.svg** - Louisville Cardinals (Red #AD0000)
- **miami.svg** - Miami Hurricanes (Orange #F47321, Green #005030)
- **nc-state.svg** - NC State Wolfpack (Red #CC0000)
- **notre-dame.svg** - Notre Dame Fighting Irish (Navy #0C2340, Gold #C99700)
- **south-carolina.svg** - South Carolina Gamecocks (Garnet #73000A)
- **syracuse.svg** - Syracuse Orange (Orange #D44500)
- **wake-forest.svg** - Wake Forest Demon Deacons (Gold #9E7E38, Black)

## Usage

These SVG logos can be used throughout the application:

```tsx
import Image from 'next/image';

<Image
  src="/images/logos/clemson.svg"
  alt="Clemson Tigers"
  width={40}
  height={40}
/>
```

Or with the TeamLogo component (see `components/ui/TeamLogo.tsx`):

```tsx
<TeamLogo team="clemson" size={40} />
```

## Notes

- All logos are simplified SVG representations
- Colors match official team brand colors where possible
- Logos are scalable vector graphics (SVG) for crisp rendering at any size
- Replace these placeholder logos with official team logos as needed
- Ensure proper licensing and usage rights when using official team logos

## Adding New Logos

To add a new team logo:

1. Create an SVG file named with the team slug (e.g., `duke.svg`)
2. Use official team colors
3. Keep the viewBox at `0 0 100 100` for consistency
4. Update this README with the new logo details
5. Add the team to the TeamLogo component mapping
