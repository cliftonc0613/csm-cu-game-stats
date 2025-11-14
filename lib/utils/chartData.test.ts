import {
  transformTeamStats,
  transformScoringData,
  transformPassingStats,
  transformRushingStats,
  transformReceivingStats,
  transformDefenseStats,
  combinePlayers,
  filterTopPlayers,
} from './chartData';
import type { TableRow } from '@/lib/markdown/tableParser';

describe('chartData transformations', () => {
  describe('transformTeamStats', () => {
    it('should transform team stats comparison data', () => {
      const rawData: TableRow[] = [
        { statistic: 'First Downs', clemson: 24, opponent: 19 },
        { statistic: 'Total Yards', clemson: 428, opponent: 312 },
        { statistic: 'Passing Yards', clemson: 228, opponent: 244 },
      ];

      const result = transformTeamStats(rawData);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        stat: 'First Downs',
        clemson: 24,
        opponent: 19,
      });
      expect(result[1]).toEqual({
        stat: 'Total Yards',
        clemson: 428,
        opponent: 312,
      });
    });

    it('should handle alternate column names', () => {
      const rawData: TableRow[] = [
        { stat: 'Turnovers', clemson: 0, opponent: 1 },
      ];

      const result = transformTeamStats(rawData);

      expect(result).toHaveLength(1);
      expect(result[0].stat).toBe('Turnovers');
    });

    it('should filter out rows with missing data', () => {
      const rawData: TableRow[] = [
        { statistic: 'First Downs', clemson: 24, opponent: 19 },
        { statistic: 'Invalid', clemson: 'N/A', opponent: 'N/A' },
        { statistic: 'Total Yards', clemson: 428, opponent: 312 },
      ];

      const result = transformTeamStats(rawData);

      expect(result).toHaveLength(2);
      expect(result[0].stat).toBe('First Downs');
      expect(result[1].stat).toBe('Total Yards');
    });

    it('should handle empty array', () => {
      const result = transformTeamStats([]);

      expect(result).toEqual([]);
    });
  });

  describe('transformScoringData', () => {
    it('should calculate cumulative scoring progression', () => {
      const rawData: TableRow[] = [
        { quarter: '1st', clemson: 10, opponent: 0 },
        { quarter: '2nd', clemson: 7, opponent: 7 },
        { quarter: '3rd', clemson: 14, opponent: 7 },
        { quarter: '4th', clemson: 3, opponent: 7 },
      ];

      const result = transformScoringData(rawData);

      expect(result).toHaveLength(4);
      expect(result[0]).toEqual({ quarter: '1st', clemson: 10, opponent: 0 });
      expect(result[1]).toEqual({ quarter: '2nd', clemson: 17, opponent: 7 });
      expect(result[2]).toEqual({ quarter: '3rd', clemson: 31, opponent: 14 });
      expect(result[3]).toEqual({ quarter: '4th', clemson: 34, opponent: 21 });
    });

    it('should exclude Final/Total rows', () => {
      const rawData: TableRow[] = [
        { quarter: '1st', clemson: 10, opponent: 0 },
        { quarter: '2nd', clemson: 7, opponent: 7 },
        { quarter: 'Final', clemson: 34, opponent: 21 },
      ];

      const result = transformScoringData(rawData);

      expect(result).toHaveLength(2);
      expect(result.every((r) => !r.quarter.toLowerCase().includes('final'))).toBe(true);
    });

    it('should handle overtime quarters', () => {
      const rawData: TableRow[] = [
        { quarter: '1st', clemson: 7, opponent: 7 },
        { quarter: '2nd', clemson: 0, opponent: 7 },
        { quarter: '3rd', clemson: 7, opponent: 0 },
        { quarter: '4th', clemson: 7, opponent: 7 },
        { quarter: 'OT', clemson: 3, opponent: 0 },
      ];

      const result = transformScoringData(rawData);

      expect(result).toHaveLength(5);
      expect(result[4]).toEqual({ quarter: 'OT', clemson: 24, opponent: 21 });
    });

    it('should handle empty array', () => {
      const result = transformScoringData([]);

      expect(result).toEqual([]);
    });
  });

  describe('transformPassingStats', () => {
    it('should transform passing stats for Clemson', () => {
      const rawData: TableRow[] = [
        {
          player: 'Cade Klubnik',
          compAtt: '24-35',
          yards: 378,
          td: 4,
          int: 1,
          rating: 168.5,
        },
      ];

      const result = transformPassingStats(rawData, 'clemson');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        player: 'Cade Klubnik',
        completions: 24,
        attempts: 35,
        yards: 378,
        touchdowns: 4,
        interceptions: 1,
        rating: 168.5,
        team: 'clemson',
      });
    });

    it('should transform passing stats for opponent', () => {
      const rawData: TableRow[] = [
        {
          player: 'Tyler Shough',
          compAtt: '18-28',
          yards: 244,
          td: 2,
          int: 2,
          rating: 122.4,
        },
      ];

      const result = transformPassingStats(rawData, 'opponent');

      expect(result).toHaveLength(1);
      expect(result[0].team).toBe('opponent');
    });

    it('should handle alternate column names', () => {
      const rawData: TableRow[] = [
        {
          player: 'QB1',
          completionAttempts: '15-20',
          yards: 200,
          touchdowns: 2,
          interceptions: 0,
          passerRating: 150.0,
        },
      ];

      const result = transformPassingStats(rawData, 'clemson');

      expect(result[0].completions).toBe(15);
      expect(result[0].attempts).toBe(20);
    });

    it('should handle missing optional fields', () => {
      const rawData: TableRow[] = [
        {
          player: 'QB1',
          compAtt: '10-15',
          yards: 120,
        },
      ];

      const result = transformPassingStats(rawData, 'clemson');

      expect(result[0].touchdowns).toBe(0);
      expect(result[0].interceptions).toBe(0);
      expect(result[0].rating).toBe(0);
    });

    it('should filter out invalid rows', () => {
      const rawData: TableRow[] = [
        { player: 'Valid QB', compAtt: '10-15', yards: 120 },
        { player: '', compAtt: '5-8', yards: 50 },
        { player: 'No Stats', compAtt: '', yards: 0 },
      ];

      const result = transformPassingStats(rawData, 'clemson');

      expect(result).toHaveLength(1);
    });
  });

  describe('transformRushingStats', () => {
    it('should transform rushing stats', () => {
      const rawData: TableRow[] = [
        {
          player: 'Phil Mafah',
          attempts: 24,
          yards: 156,
          avg: 6.5,
          td: 1,
          long: 38,
        },
      ];

      const result = transformRushingStats(rawData, 'clemson');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        player: 'Phil Mafah',
        attempts: 24,
        yards: 156,
        average: 6.5,
        touchdowns: 1,
        long: 38,
        team: 'clemson',
      });
    });

    it('should calculate average if not provided', () => {
      const rawData: TableRow[] = [
        {
          player: 'RB1',
          attempts: 10,
          yards: 50,
          td: 0,
          long: 15,
        },
      ];

      const result = transformRushingStats(rawData, 'clemson');

      expect(result[0].average).toBe(5.0);
    });

    it('should handle alternate column names', () => {
      const rawData: TableRow[] = [
        {
          player: 'RB1',
          att: 15,
          yds: 75,
          average: 5.0,
          touchdowns: 1,
          lng: 20,
        },
      ];

      const result = transformRushingStats(rawData, 'clemson');

      expect(result[0].attempts).toBe(15);
      expect(result[0].yards).toBe(75);
    });

    it('should filter out invalid rows', () => {
      const rawData: TableRow[] = [
        { player: 'Valid RB', attempts: 10, yards: 50 },
        { player: '', attempts: 5, yards: 20 },
        { player: 'No Stats' },
      ];

      const result = transformRushingStats(rawData, 'clemson');

      expect(result).toHaveLength(1);
    });
  });

  describe('transformReceivingStats', () => {
    it('should transform receiving stats', () => {
      const rawData: TableRow[] = [
        {
          player: 'Antonio Williams',
          receptions: 8,
          targets: 11,
          yards: 149,
          avg: 18.6,
          td: 2,
          long: 45,
        },
      ];

      const result = transformReceivingStats(rawData, 'clemson');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        player: 'Antonio Williams',
        receptions: 8,
        targets: 11,
        yards: 149,
        average: 18.6,
        touchdowns: 2,
        long: 45,
        team: 'clemson',
      });
    });

    it('should calculate average if not provided', () => {
      const rawData: TableRow[] = [
        {
          player: 'WR1',
          receptions: 5,
          targets: 8,
          yards: 75,
        },
      ];

      const result = transformReceivingStats(rawData, 'clemson');

      expect(result[0].average).toBe(15.0);
    });

    it('should default targets to receptions if missing', () => {
      const rawData: TableRow[] = [
        {
          player: 'WR1',
          receptions: 5,
          yards: 75,
        },
      ];

      const result = transformReceivingStats(rawData, 'clemson');

      expect(result[0].targets).toBe(5);
    });

    it('should handle alternate column names', () => {
      const rawData: TableRow[] = [
        {
          player: 'WR1',
          rec: 6,
          tgt: 9,
          yds: 88,
          average: 14.7,
          touchdowns: 1,
          lng: 32,
        },
      ];

      const result = transformReceivingStats(rawData, 'clemson');

      expect(result[0].receptions).toBe(6);
      expect(result[0].targets).toBe(9);
    });
  });

  describe('transformDefenseStats', () => {
    it('should transform defense stats', () => {
      const rawData: TableRow[] = [
        {
          player: 'Barrett Carter',
          tackles: 12,
          solo: 7,
          tfl: 2.5,
          sacks: 1.0,
          int: 1,
          pd: 2,
          fr: 0,
        },
      ];

      const result = transformDefenseStats(rawData, 'clemson');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        player: 'Barrett Carter',
        tackles: 12,
        soloTackles: 7,
        tacklesForLoss: 2.5,
        sacks: 1.0,
        interceptions: 1,
        passesDefended: 2,
        fumblesRecovered: 0,
        team: 'clemson',
      });
    });

    it('should default solo tackles to total if missing', () => {
      const rawData: TableRow[] = [
        {
          player: 'LB1',
          tackles: 10,
          tfl: 1.0,
          sacks: 0.5,
        },
      ];

      const result = transformDefenseStats(rawData, 'clemson');

      expect(result[0].soloTackles).toBe(10);
    });

    it('should handle alternate column names', () => {
      const rawData: TableRow[] = [
        {
          player: 'LB1',
          tacTotal: 9,
          soloTackles: 5,
          tacklesForLoss: 1.5,
          sack: 0.5,
          interceptions: 0,
          passesDefended: 1,
          fumRec: 1,
        },
      ];

      const result = transformDefenseStats(rawData, 'clemson');

      expect(result[0].tackles).toBe(9);
      expect(result[0].fumblesRecovered).toBe(1);
    });

    it('should handle missing optional fields', () => {
      const rawData: TableRow[] = [
        {
          player: 'LB1',
          tackles: 8,
        },
      ];

      const result = transformDefenseStats(rawData, 'clemson');

      expect(result[0].tacklesForLoss).toBe(0);
      expect(result[0].sacks).toBe(0);
      expect(result[0].interceptions).toBe(0);
    });
  });

  describe('combinePlayers', () => {
    it('should combine Clemson and Opponent player arrays', () => {
      const clemsonData = [
        { player: 'Player1', yards: 100, team: 'clemson' as const },
      ];
      const opponentData = [
        { player: 'Player2', yards: 80, team: 'opponent' as const },
      ];

      const result = combinePlayers(clemsonData, opponentData);

      expect(result).toHaveLength(2);
      expect(result[0].team).toBe('clemson');
      expect(result[1].team).toBe('opponent');
    });

    it('should handle empty arrays', () => {
      const result = combinePlayers([], []);

      expect(result).toEqual([]);
    });
  });

  describe('filterTopPlayers', () => {
    it('should filter top N players by stat', () => {
      const data = [
        { player: 'Player1', yards: 150 },
        { player: 'Player2', yards: 200 },
        { player: 'Player3', yards: 75 },
        { player: 'Player4', yards: 125 },
        { player: 'Player5', yards: 180 },
      ];

      const result = filterTopPlayers(data, 'yards', 3);

      expect(result).toHaveLength(3);
      expect(result[0].player).toBe('Player2');
      expect(result[1].player).toBe('Player5');
      expect(result[2].player).toBe('Player1');
    });

    it('should default to 5 players if limit not specified', () => {
      const data = Array.from({ length: 10 }, (_, i) => ({
        player: `Player${i}`,
        yards: i * 10,
      }));

      const result = filterTopPlayers(data, 'yards');

      expect(result).toHaveLength(5);
    });

    it('should handle fewer players than limit', () => {
      const data = [
        { player: 'Player1', yards: 100 },
        { player: 'Player2', yards: 50 },
      ];

      const result = filterTopPlayers(data, 'yards', 5);

      expect(result).toHaveLength(2);
    });
  });
});
