import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { pillars, Pillar } from '@/data/pillars';
import { toast } from 'sonner';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export interface PillarSelection {
    pillarId: string;
    subPillarIds: string[];
}

interface TabulationFormProps {
    onSubmit: (selections: PillarSelection[]) => void;
    initialSelections?: PillarSelection[];
    isSubmitting?: boolean;
}

const TabulationForm = ({ onSubmit, initialSelections = [], isSubmitting = false }: TabulationFormProps) => {
    const [selections, setSelections] = useState<PillarSelection[]>(initialSelections);
    const [currentPillarId, setCurrentPillarId] = useState<string>('');

    const currentPillar = pillars.find(p => p.id === currentPillarId);

    const handlePillarChange = (value: string) => {
        setCurrentPillarId(value);
    };

    const handleSubPillarToggle = (subPillarId: string) => {
        if (!currentPillarId) return;

        setSelections(prev => {
            const existingSelectionIndex = prev.findIndex(s => s.pillarId === currentPillarId);

            if (existingSelectionIndex >= 0) {
                // Update existing selection
                const existingSelection = prev[existingSelectionIndex];
                const hasSubPillar = existingSelection.subPillarIds.includes(subPillarId);

                let newSubPillars: string[];
                if (hasSubPillar) {
                    newSubPillars = existingSelection.subPillarIds.filter(id => id !== subPillarId);
                } else {
                    newSubPillars = [...existingSelection.subPillarIds, subPillarId];
                }

                // If no sub-pillars left, remove the pillar selection entirely? 
                // Or keep it empty? Let's keep it but maybe validate later.
                // For now, let's remove the pillar selection if no sub-pillars are selected to keep it clean,
                // OR keep it to allow "General" pillar selection if that's a use case.
                // Assuming we want specific sub-pillars:

                const newSelections = [...prev];
                if (newSubPillars.length === 0) {
                    newSelections.splice(existingSelectionIndex, 1);
                } else {
                    newSelections[existingSelectionIndex] = {
                        ...existingSelection,
                        subPillarIds: newSubPillars
                    };
                }
                return newSelections;

            } else {
                // Create new selection
                return [...prev, { pillarId: currentPillarId, subPillarIds: [subPillarId] }];
            }
        });
    };

    const isSubPillarSelected = (pillarId: string, subPillarId: string) => {
        const selection = selections.find(s => s.pillarId === pillarId);
        return selection?.subPillarIds.includes(subPillarId) || false;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selections.length === 0) {
            toast.error('Selecione pelo menos um pilar e sub-pilar.');
            return;
        }
        onSubmit(selections);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-background border border-border rounded-xl p-6">
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-cobalto" />
                    <h3 className="text-lg font-semibold text-foreground">Tabulação do Resultado</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Label htmlFor="pillar-select">Selecione o Pilar</Label>
                        <Select value={currentPillarId} onValueChange={handlePillarChange}>
                            <SelectTrigger id="pillar-select" className="w-full">
                                <SelectValue placeholder="Escolha uma categoria..." />
                            </SelectTrigger>
                            <SelectContent>
                                {pillars.map((pillar) => (
                                    <SelectItem key={pillar.id} value={pillar.id}>
                                        {pillar.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Summary of selections */}
                        {selections.length > 0 && (
                            <div className="mt-4 p-4 bg-foreground/5 rounded-lg space-y-2">
                                <h4 className="text-sm font-medium text-foreground/80 mb-2">Resumo da Seleção:</h4>
                                {selections.map(selection => {
                                    const p = pillars.find(p => p.id === selection.pillarId);
                                    if (!p) return null;
                                    return (
                                        <div key={selection.pillarId} className="text-sm">
                                            <span className="font-semibold text-cobalto">{p.label}:</span>{' '}
                                            <span className="text-foreground/70">
                                                {selection.subPillarIds.map(id => p.subPillars.find(sp => sp.id === id)?.label).join(', ')}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="bg-foreground/5 rounded-lg p-4 min-h-[200px]">
                        {currentPillar ? (
                            <div className="space-y-3">
                                <h4 className="font-medium text-foreground mb-3">{currentPillar.label} - Sub-pilares</h4>
                                {currentPillar.subPillars.map((subPillar) => (
                                    <div key={subPillar.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={subPillar.id}
                                            checked={isSubPillarSelected(currentPillar.id, subPillar.id)}
                                            onCheckedChange={() => handleSubPillarToggle(subPillar.id)}
                                        />
                                        <Label
                                            htmlFor={subPillar.id}
                                            className="text-sm font-normal cursor-pointer text-foreground/80 hover:text-foreground"
                                        >
                                            {subPillar.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-foreground/40 text-center p-4">
                                <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                                <p>Selecione um pilar para ver as opções disponíveis</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
                <Button
                    type="submit"
                    disabled={isSubmitting || selections.length === 0}
                    className="bg-cobalto hover:bg-noite text-white"
                >
                    {isSubmitting ? 'Salvando...' : 'Salvar Tabulação'}
                </Button>
            </div>
        </form>
    );
};

export default TabulationForm;
