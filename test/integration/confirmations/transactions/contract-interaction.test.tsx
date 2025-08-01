import { ApprovalType } from '@metamask/controller-utils';
import { TransactionType } from '@metamask/transaction-controller';
import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import nock from 'nock';
import {
  MetaMetricsEventCategory,
  MetaMetricsEventLocation,
  MetaMetricsEventName,
} from '../../../../shared/constants/metametrics';
import { useAssetDetails } from '../../../../ui/pages/confirmations/hooks/useAssetDetails';
import * as backgroundConnection from '../../../../ui/store/background-connection';
import { tEn } from '../../../lib/i18n-helpers';
import { integrationTestRender } from '../../../lib/render-helpers';
import mockMetaMaskState from '../../data/integration-init-state.json';
import { createMockImplementation, mock4byte } from '../../helpers';
import {
  getMaliciousUnapprovedTransaction,
  getUnapprovedContractInteractionTransaction,
} from './transactionDataHelpers';

jest.setTimeout(20_000);

jest.mock('../../../../ui/store/background-connection', () => ({
  ...jest.requireActual('../../../../ui/store/background-connection'),
  submitRequestToBackground: jest.fn(),
  callBackgroundMethod: jest.fn(),
}));

jest.mock('../../../../ui/pages/confirmations/hooks/useAssetDetails', () => ({
  ...jest.requireActual(
    '../../../../ui/pages/confirmations/hooks/useAssetDetails',
  ),
  useAssetDetails: jest.fn().mockResolvedValue({
    decimals: '4',
  }),
}));

const mockedBackgroundConnection = jest.mocked(backgroundConnection);
const mockedAssetDetails = jest.mocked(useAssetDetails);

const backgroundConnectionMocked = {
  onNotification: jest.fn(),
};
export const pendingTransactionId = '48a75190-45ca-11ef-9001-f3886ec2397c';
export const pendingTransactionTime = new Date().getTime();

const getMetaMaskStateWithUnapprovedContractInteraction = ({
  accountAddress,
  showConfirmationAdvancedDetails = false,
}: {
  accountAddress: string;
  showConfirmationAdvancedDetails?: boolean;
}) => {
  return {
    ...mockMetaMaskState,
    preferences: {
      ...mockMetaMaskState.preferences,
      showConfirmationAdvancedDetails,
    },
    nextNonce: '8',
    currencyRates: {
      SepoliaETH: {
        conversionDate: 1721392020.645,
        conversionRate: 3404.13,
        usdConversionRate: 3404.13,
      },
      ETH: {
        conversionDate: 1721393858.083,
        conversionRate: 3414.67,
        usdConversionRate: 3414.67,
      },
    },
    currentCurrency: 'usd',
    pendingApprovals: {
      [pendingTransactionId]: {
        id: pendingTransactionId,
        origin: 'local:http://localhost:8086/',
        time: pendingTransactionTime,
        type: ApprovalType.Transaction,
        requestData: {
          txId: pendingTransactionId,
        },
        requestState: null,
        expectsResult: false,
      },
    },
    pendingApprovalCount: 1,
    knownMethodData: {
      '0x3b4b1381': {
        name: 'Mint NFTs',
        params: [
          {
            type: 'uint256',
          },
        ],
      },
    },
    transactions: [
      getUnapprovedContractInteractionTransaction(
        accountAddress,
        pendingTransactionId,
        pendingTransactionTime,
      ),
    ],
  };
};

const advancedDetailsMockedRequests = {
  getGasFeeTimeEstimate: {
    lowerTimeBound: new Date().getTime(),
    upperTimeBound: new Date().getTime(),
  },
  getNextNonce: '9',
  decodeTransactionData: {
    data: [
      {
        name: 'mintNFTs',
        params: [
          {
            name: 'numberOfTokens',
            type: 'uint256',
            value: 1,
          },
        ],
      },
    ],
    source: 'Sourcify',
  },
};

const setupSubmitRequestToBackgroundMocks = (
  mockRequests?: Record<string, unknown>,
) => {
  mockedBackgroundConnection.submitRequestToBackground.mockImplementation(
    createMockImplementation({
      ...advancedDetailsMockedRequests,
      ...(mockRequests ?? {}),
    }),
  );
};

const getMetaMaskStateWithMaliciousUnapprovedContractInteraction = (
  accountAddress: string,
) => {
  return {
    ...getMetaMaskStateWithUnapprovedContractInteraction({ accountAddress }),
    transactions: [
      getMaliciousUnapprovedTransaction(
        accountAddress,
        pendingTransactionId,
        pendingTransactionTime,
      ),
    ],
  };
};

describe('Contract Interaction Confirmation', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    setupSubmitRequestToBackgroundMocks();
    const MINT_NFT_HEX_SIG = '0x3b4b1381';
    mock4byte(MINT_NFT_HEX_SIG);
    mockedAssetDetails.mockImplementation(() => ({
      // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31973
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      decimals: '4' as any,
    }));
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('displays the header account modal with correct data', async () => {
    const account =
      mockMetaMaskState.internalAccounts.accounts[
        mockMetaMaskState.internalAccounts
          .selectedAccount as keyof typeof mockMetaMaskState.internalAccounts.accounts
      ];

    const accountName = account.metadata.name;
    const mockedMetaMaskState =
      getMetaMaskStateWithUnapprovedContractInteraction({
        accountAddress: account.address,
      });

    await act(async () => {
      await integrationTestRender({
        preloadedState: {
          ...mockedMetaMaskState,
          participateInMetaMetrics: true,
          dataCollectionForMarketing: false,
        },
        backgroundConnection: backgroundConnectionMocked,
      });
    });

    await screen.findByText(accountName);
    expect(await screen.findByTestId('header-account-name')).toHaveTextContent(
      accountName,
    );
    expect(
      await screen.findByTestId('header-network-display-name'),
    ).toHaveTextContent('Sepolia');

    await act(async () => {
      fireEvent.click(
        await screen.findByTestId('header-info__account-details-button'),
      );
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('confirmation-account-details-modal__account-name'),
      ).toHaveTextContent(accountName);
    });
    expect(screen.getByTestId('address-copy-button-text')).toHaveTextContent(
      '0x0DCD5...3E7bc',
    );
    expect(
      screen.getByTestId('confirmation-account-details-modal__account-balance'),
    ).toHaveTextContent('1.582717SepoliaETH');

    let confirmAccountDetailsModalMetricsEvent;

    await waitFor(() => {
      confirmAccountDetailsModalMetricsEvent =
        mockedBackgroundConnection.submitRequestToBackground.mock.calls?.find(
          (call) =>
            call[0] === 'trackMetaMetricsEvent' &&
            call[1]?.[0].category === MetaMetricsEventCategory.Confirmations,
        );

      expect(confirmAccountDetailsModalMetricsEvent?.[0]).toBe(
        'trackMetaMetricsEvent',
      );

      expect(confirmAccountDetailsModalMetricsEvent?.[1]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            category: MetaMetricsEventCategory.Confirmations,
            event: MetaMetricsEventName.AccountDetailsOpened,
            properties: {
              action: 'Confirm Screen',
              location: MetaMetricsEventLocation.Transaction,
              // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31860
              // eslint-disable-next-line @typescript-eslint/naming-convention
              transaction_type: TransactionType.contractInteraction,
              // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31860
              // eslint-disable-next-line @typescript-eslint/naming-convention
              hd_entropy_index: 0,
            },
          }),
        ]),
      );
    });

    fireEvent.click(
      screen.getByTestId('confirmation-account-details-modal__close-button'),
    );

    await waitFor(() => {
      expect(
        screen.queryByTestId(
          'confirmation-account-details-modal__account-name',
        ),
      ).not.toBeInTheDocument();
    });
  });

  it('displays the transaction details section', async () => {
    const account =
      mockMetaMaskState.internalAccounts.accounts[
        mockMetaMaskState.internalAccounts
          .selectedAccount as keyof typeof mockMetaMaskState.internalAccounts.accounts
      ];

    const mockedMetaMaskState =
      getMetaMaskStateWithUnapprovedContractInteraction({
        accountAddress: account.address,
      });

    await act(async () => {
      await integrationTestRender({
        preloadedState: mockedMetaMaskState,
        backgroundConnection: backgroundConnectionMocked,
      });
    });

    expect(
      await screen.findByText(tEn('confirmTitleTransaction') as string),
    ).toBeInTheDocument();

    const simulationSection = await screen.findByTestId(
      'simulation-details-layout',
    );
    expect(simulationSection).toBeInTheDocument();
    expect(simulationSection).toHaveTextContent(
      tEn('simulationDetailsTitle') as string,
    );
    const simulationDetailsRow = await screen.findByTestId(
      'simulation-rows-incoming',
    );
    expect(simulationSection).toContainElement(simulationDetailsRow);
    expect(simulationDetailsRow).toHaveTextContent(
      tEn('simulationDetailsIncomingHeading') as string,
    );
    expect(simulationDetailsRow).toContainElement(
      await screen.findByTestId('simulation-details-amount-pill'),
    );

    const transactionDetailsSection = await screen.findByTestId(
      'transaction-details-section',
    );
    expect(transactionDetailsSection).toBeInTheDocument();
    expect(transactionDetailsSection).toHaveTextContent(
      tEn('requestFrom') as string,
    );
    expect(transactionDetailsSection).toHaveTextContent(
      tEn('interactingWith') as string,
    );

    const gasFeesSection = await screen.findByTestId('gas-fee-section');
    expect(gasFeesSection).toBeInTheDocument();

    const editGasFeesRow =
      await within(gasFeesSection).findByTestId('edit-gas-fees-row');
    expect(editGasFeesRow).toHaveTextContent(tEn('networkFee') as string);

    const firstGasField =
      await within(editGasFeesRow).findByTestId('first-gas-field');
    expect(firstGasField).toHaveTextContent('0.0001');
    expect(editGasFeesRow).toContainElement(
      await screen.findByTestId('edit-gas-fee-icon'),
    );

    const gasFeeSpeed = await within(gasFeesSection).findByTestId(
      'gas-fee-details-speed',
    );
    expect(gasFeeSpeed).toHaveTextContent(tEn('speed') as string);

    const gasTimingTime =
      await within(gasFeeSpeed).findByTestId('gas-timing-time');
    expect(gasTimingTime).toHaveTextContent('~0 sec');
  });

  it('sets the preference showConfirmationAdvancedDetails to true when advanced details button is clicked', async () => {
    mockedBackgroundConnection.callBackgroundMethod.mockImplementation(
      // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31879
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      createMockImplementation({ setPreference: {} }),
    );

    const account =
      mockMetaMaskState.internalAccounts.accounts[
        mockMetaMaskState.internalAccounts
          .selectedAccount as keyof typeof mockMetaMaskState.internalAccounts.accounts
      ];

    const mockedMetaMaskState =
      getMetaMaskStateWithUnapprovedContractInteraction({
        accountAddress: account.address,
        showConfirmationAdvancedDetails: false,
      });

    await act(async () => {
      await integrationTestRender({
        preloadedState: mockedMetaMaskState,
        backgroundConnection: backgroundConnectionMocked,
      });
    });

    fireEvent.click(
      await screen.findByTestId('header-advanced-details-button'),
    );

    await waitFor(() => {
      expect(
        mockedBackgroundConnection.callBackgroundMethod,
      ).toHaveBeenCalledWith(
        'setPreference',
        ['showConfirmationAdvancedDetails', true],
        expect.anything(),
      );
    });
  });

  it('displays the advanced transaction details section', async () => {
    mockedBackgroundConnection.callBackgroundMethod.mockImplementation(
      // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31879
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      createMockImplementation({ setPreference: {} }),
    );

    const account =
      mockMetaMaskState.internalAccounts.accounts[
        mockMetaMaskState.internalAccounts
          .selectedAccount as keyof typeof mockMetaMaskState.internalAccounts.accounts
      ];

    const mockedMetaMaskState =
      getMetaMaskStateWithUnapprovedContractInteraction({
        accountAddress: account.address,
        showConfirmationAdvancedDetails: true,
      });

    await act(async () => {
      await integrationTestRender({
        preloadedState: mockedMetaMaskState,
        backgroundConnection: backgroundConnectionMocked,
      });
    });

    await waitFor(() => {
      expect(
        mockedBackgroundConnection.submitRequestToBackground,
      ).toHaveBeenCalledWith('getNextNonce', expect.anything());
    });

    await waitFor(() => {
      expect(
        mockedBackgroundConnection.submitRequestToBackground,
      ).toHaveBeenCalledWith('decodeTransactionData', [
        {
          transactionData:
            '0x3b4b13810000000000000000000000000000000000000000000000000000000000000001',
          contractAddress: '0x076146c765189d51be3160a2140cf80bfc73ad68',
          chainId: '0xaa36a7',
        },
      ]);
    });

    const gasFeesSection = await screen.findByTestId('gas-fee-section');
    const maxFee = await screen.findByTestId('gas-fee-details-max-fee');
    expect(gasFeesSection).toContainElement(maxFee);
    expect(maxFee).toHaveTextContent(tEn('maxFee') as string);
    expect(maxFee).toHaveTextContent('0.0023');

    const nonceSection = await screen.findByTestId(
      'advanced-details-nonce-section',
    );
    expect(nonceSection).toBeInTheDocument();
    expect(nonceSection).toHaveTextContent(
      tEn('advancedDetailsNonceDesc') as string,
    );
    expect(nonceSection).toContainElement(
      await screen.findByTestId('advanced-details-displayed-nonce'),
    );
    expect(
      await screen.findByTestId('advanced-details-displayed-nonce'),
    ).toHaveTextContent('9');

    const dataSection = await screen.findByTestId(
      'advanced-details-data-section',
    );
    expect(dataSection).toBeInTheDocument();

    const dataSectionFunction = await screen.findByTestId(
      'advanced-details-data-function',
    );
    expect(dataSection).toContainElement(dataSectionFunction);
    expect(dataSectionFunction).toHaveTextContent(
      tEn('transactionDataFunction') as string,
    );
    expect(dataSectionFunction).toHaveTextContent('mintNFTs');

    const transactionDataParams = await screen.findByTestId(
      'advanced-details-data-param-0',
    );
    expect(dataSection).toContainElement(transactionDataParams);
    expect(transactionDataParams).toHaveTextContent('Number Of Tokens');
    expect(transactionDataParams).toHaveTextContent('1');
  });

  it('displays the warning for malicious request', async () => {
    const account =
      mockMetaMaskState.internalAccounts.accounts[
        mockMetaMaskState.internalAccounts
          .selectedAccount as keyof typeof mockMetaMaskState.internalAccounts.accounts
      ];

    const mockedMetaMaskState =
      getMetaMaskStateWithMaliciousUnapprovedContractInteraction(
        account.address,
      );

    await act(async () => {
      await integrationTestRender({
        preloadedState: mockedMetaMaskState,
        backgroundConnection: backgroundConnectionMocked,
      });
    });

    const headingText = tEn('blockaidTitleDeceptive') as string;
    const bodyText = tEn('blockaidDescriptionTransferFarming') as string;
    expect(await screen.findByText(headingText)).toBeInTheDocument();
    expect(await screen.findByText(bodyText)).toBeInTheDocument();
  });

  it('tracks external link clicked in transaction metrics', async () => {
    const account =
      mockMetaMaskState.internalAccounts.accounts[
        mockMetaMaskState.internalAccounts
          .selectedAccount as keyof typeof mockMetaMaskState.internalAccounts.accounts
      ];

    const mockedMetaMaskState =
      getMetaMaskStateWithMaliciousUnapprovedContractInteraction(
        account.address,
      );

    await act(async () => {
      await integrationTestRender({
        preloadedState: mockedMetaMaskState,
        backgroundConnection: backgroundConnectionMocked,
      });
    });

    fireEvent.click(await screen.findByTestId('disclosure'));
    expect(
      await screen.findByTestId('alert-provider-report-link'),
    ).toBeInTheDocument();

    fireEvent.click(await screen.findByTestId('alert-provider-report-link'));

    fireEvent.click(await screen.findByTestId('confirm-footer-cancel-button'));

    expect(
      mockedBackgroundConnection.submitRequestToBackground,
    ).toHaveBeenCalledWith(
      'updateEventFragment',
      expect.arrayContaining([
        expect.objectContaining({
          properties: expect.objectContaining({
            // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31860
            // eslint-disable-next-line @typescript-eslint/naming-convention
            external_link_clicked: 'security_alert_support_link',
          }),
        }),
      ]),
    );
  });
});
