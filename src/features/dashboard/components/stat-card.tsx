import { cn } from '@/libs/utils';
import { Card } from '@ui5/webcomponents-react/Card';
import { Text } from '@ui5/webcomponents-react/Text';
import { Title } from '@ui5/webcomponents-react/Title';
import { CardHeader } from '@ui5/webcomponents-react/CardHeader';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  details?: Array<{
    label: string;
    value: string;
  }>;
}

export function StatCard({ title, value, subtitle, details = [] }: StatCardProps) {
  return (
    <Card
      className={cn('h-full rounded-3xl shadow-sm')}
      header={<CardHeader titleText={title} subtitleText={subtitle} />}
    >
      <div className="space-y-4 p-4">
        <Title level="H2" className="text-3xl font-semibold tracking-tight">
          {value}
        </Title>
        {details.length > 0 && (
          <div className="grid gap-2 sm:grid-cols-2">
            {details.map((detail) => (
              <div key={detail.label} className="px-3 py-2">
                <Text className="block text-xs uppercase tracking-[0.12em]">{detail.label}</Text>
                <Text className="block text-sm font-medium">{detail.value}</Text>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
