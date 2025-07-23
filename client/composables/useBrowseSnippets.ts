import { orderBy as _orderBy } from 'lodash';
import hotkeys from 'hotkeys-js';

export function useBrowseSnippet(steps: Ref<Step[] | undefined>) {
  
  const router = useRouter();
  const route = useRoute();

  const orderedStepAsc = computed(() => {
    return _orderBy(steps.value, 'order', 'asc');
  });

  const orderedStepsDesc = computed(() => {
    return _orderBy(steps.value, 'order', 'desc');
  });

  const firstStep = computed(() => {
    return orderedStepsDesc.value[0];
  });

  const currentStep = computed(() => {
    return (
      orderedStepAsc.value.find(
        step => step.uuid === route.query.step,
      ) || firstStep.value
    );
  });

  const currentStepIndex = computed(() => {
    return orderedStepAsc.value
      .map(step => step.uuid)
      .indexOf(currentStep.value.uuid);
  });

  const nextStep = computed(() => {
    return orderedStepAsc.value.find(
      (step) => step.order > currentStep.value.order
    ) || orderedStepAsc.value?.[0];
  });

  const previousStep = computed(() => {
    return (
      orderedStepsDesc.value.find(
        (step) => step.order < currentStep.value.order
      ) || orderedStepsDesc.value?.[0]
    );
  });

  const goToStep = (step: Step) => {
    router.push({
      query: {
        step: step.uuid,
      },
    });
  };

  const registerKeyboardShortcuts = () => {
    hotkeys('ctrl+shift+left,ctrl+shift+right', (event, handler) => {
      switch (handler.key) {
        case 'ctrl+shift+left':
          if (previousStep.value) {
            goToStep(previousStep.value);
          }
          break;
        case 'ctrl+shift+right':
          if (nextStep.value) {
            goToStep(nextStep.value);
          }
          break;
      }
    });
  };

  return {
    orderedStepAsc,
    orderedStepsDesc,
    previousStep,
    nextStep,
    currentStepIndex,
    currentStep,
    firstStep,
    goToStep,
    registerKeyboardShortcuts,
  };
}
