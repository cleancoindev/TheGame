import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  MetaButton,
  MetaHeading,
  Text,
  useToast,
} from '@metafam/ds';
import { FlexContainer } from 'components/Container';
import { useSetupFlow } from 'contexts/SetupContext';
import { useUpdateProfileMutation } from 'graphql/autogen/types';
import { useUser } from 'lib/hooks';
import React, { useEffect, useState } from 'react';

export const SetupAvailability: React.FC = () => {
  const {
    onNextPress,
    nextButtonLabel,
    availability,
    setAvailability,
  } = useSetupFlow();
  const [invalid, setInvalid] = useState(false);
  const { user } = useUser({ redirectTo: '/' });
  const toast = useToast();

  useEffect(() => {
    const value = Number(availability);
    setInvalid(value < 0 || value > 168);
  }, [availability]);

  const [updateProfileRes, updateProfile] = useUpdateProfileMutation();

  const handleNextPress = async () => {
    if (!user) return;

    const { error } = await updateProfile({
      playerId: user.id,
      input: {
        availability_hours: Number(availability)
      }
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
      toast({
        title: 'Error',
        description: 'Unable to update availability. The octo is sad 😢',
        status: 'error',
        isClosable: true,
      });
      return;
    }

    onNextPress();
  };

  return (
    <FlexContainer>
      <MetaHeading mb={5} textAlign="center">
        Availability
      </MetaHeading>
      <Text mb={10}>
        What is your weekly availability for any kind of freelance work?
      </Text>
      <InputGroup borderColor="transparent" mb={10}>
        <InputLeftElement>
          <span role="img" aria-label="clock">
            🕛
          </span>
        </InputLeftElement>
        <Input
          background="dark"
          placeholder="40"
          type="number"
          value={availability}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAvailability(e.target.value)
          }
          isInvalid={invalid}
        />
        <InputRightAddon background="purpleBoxDark">hr/week</InputRightAddon>
      </InputGroup>

      <MetaButton
        onClick={handleNextPress}
        mt={10}
        isDisabled={invalid}
        isLoading={updateProfileRes.fetching}
        loadingText="Saving"
      >
        {nextButtonLabel}
      </MetaButton>
    </FlexContainer>
  );
};
