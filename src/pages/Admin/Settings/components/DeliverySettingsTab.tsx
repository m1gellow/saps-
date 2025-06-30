import { Truck } from "lucide-react";
import { DeliverySettings } from "../../../../types";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";


interface DeliverySettingsTabProps {
  settings: DeliverySettings;
  onToggleFreeDelivery: (checked: boolean) => void;
  onThresholdChange: (value: number) => void;
  onToggleMethod: (methodId: string) => void;
  onMethodPriceChange: (methodId: string, price: number) => void;
}

export const DeliverySettingsTab = ({
  settings,
  onToggleFreeDelivery,
  onThresholdChange,
  onToggleMethod,
  onMethodPriceChange,
}: DeliverySettingsTabProps) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
      <Truck size={20} className="text-blue-600" />
      Настройки доставки
    </h2>

    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mb-6">
      <div className="flex items-center space-x-3">
        <Checkbox
          id="enableFreeDelivery"
          checked={settings.enableFreeDelivery}
          onCheckedChange={onToggleFreeDelivery}
          className="h-5 w-5 border-gray-300 rounded text-blue-600"
        />
        <label htmlFor="enableFreeDelivery" className="text-sm text-gray-700">
          Включить бесплатную доставку при сумме заказа выше порога
        </label>
      </div>

      {settings.enableFreeDelivery && (
        <div className="mt-3 ml-8 space-y-2">
          <label className="block text-sm font-medium text-gray-700">Порог бесплатной доставки (₽)</label>
          <Input
            type="number"
            value={settings.freeDeliveryThreshold}
            onChange={(e) => onThresholdChange(parseInt(e.target.value) || 0)}
            className="w-full md:w-1/3"
          />
        </div>
      )}
    </div>

    <h3 className="text-lg font-medium text-gray-900 mb-3">Способы доставки</h3>

    <div className="space-y-3">
      {settings.deliveryMethods.map((method) => (
        <div
          key={method.id}
          className={`p-4 rounded-lg border ${
            method.enabled ? 'border-blue-100 bg-blue-50' : 'border-gray-200 bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Checkbox
                id={`method-${method.id}`}
                checked={method.enabled}
                onCheckedChange={() => onToggleMethod(method.id)}
                className="h-5 w-5 border-gray-300 rounded text-blue-600"
              />
              <label htmlFor={`method-${method.id}`} className="text-sm font-medium text-gray-700">
                {method.name}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={method.price}
                onChange={(e) => onMethodPriceChange(method.id, parseInt(e.target.value) || 0)}
                className="w-24 text-right"
                disabled={!method.enabled}
              />
              <span className="text-sm text-gray-500">₽</span>
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" className="w-full mt-3 border-dashed">
        + Добавить способ доставки
      </Button>
    </div>
  </div>
);