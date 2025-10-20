import { Card, CardActionArea, CardContent, Stack, Typography, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { QueryItem } from '@/types';

interface Props {
  item: QueryItem;
}

// A compact query card for folder previews
export default function MiniQueryCard({ item }: Props) {
  return (
    <Card sx={{ borderRadius: 2, border: (t) => `1px solid ${t.palette.divider}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <CardActionArea component={Link} to={`/query/${item.id}`}>
        <CardContent sx={{ py: 1.0, px: 1.25 }}>
          <Stack spacing={0}>
            <Tooltip title={item.name}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.name}
              </Typography>
            </Tooltip>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
