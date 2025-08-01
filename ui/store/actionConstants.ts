export const GO_HOME = 'GO_HOME';
// modal state
export const MODAL_OPEN = 'UI_MODAL_OPEN';
export const MODAL_CLOSE = 'UI_MODAL_CLOSE';
export const SET_CONFIRMATION_EXCHANGE_RATES =
  'SET_CONFIRMATION_EXCHANGE_RATES';
// alert state
export const ALERT_OPEN = 'UI_ALERT_OPEN';
export const ALERT_CLOSE = 'UI_ALERT_CLOSE';
export const QR_CODE_DETECTED = 'UI_QR_CODE_DETECTED';
// network dropdown open
export const NETWORK_DROPDOWN_OPEN = 'UI_NETWORK_DROPDOWN_OPEN';
export const NETWORK_DROPDOWN_CLOSE = 'UI_NETWORK_DROPDOWN_CLOSE';
export const IMPORT_NFTS_MODAL_OPEN = 'UI_IMPORT_NFTS_MODAL_OPEN';
export const IMPORT_NFTS_MODAL_CLOSE = 'UI_IMPORT_NFTS_MODAL_CLOSE';
export const SHOW_IPFS_MODAL_OPEN = 'UI_IPFS_MODAL_OPEN';
export const SHOW_PERMITTED_NETWORK_TOAST_OPEN =
  'UI_PERMITTED_NETWORK_TOAST_OPEN';
export const SHOW_PERMITTED_NETWORK_TOAST_CLOSE =
  'UI_PERMITTED_NETWORK_TOAST_CLOSE';
export const SHOW_IPFS_MODAL_CLOSE = 'UI_IPFS_MODAL_CLOSE';
export const IMPORT_TOKENS_POPOVER_OPEN = 'UI_IMPORT_TOKENS_POPOVER_OPEN';
export const IMPORT_TOKENS_POPOVER_CLOSE = 'UI_IMPORT_TOKENS_POPOVER_CLOSE';
export const SHOW_BASIC_FUNCTIONALITY_MODAL_OPEN =
  'SHOW_BASIC_FUNCTIONALITY_MODAL_OPEN';
export const SHOW_BASIC_FUNCTIONALITY_MODAL_CLOSE =
  'SHOW_BASIC_FUNCTIONALITY_MODAL_CLOSE';
export const ONBOARDING_TOGGLE_BASIC_FUNCTIONALITY_ON =
  'ONBOARDING_TOGGLE_BASIC_FUNCTIONALITY_ON';
export const ONBOARDING_TOGGLE_BASIC_FUNCTIONALITY_OFF =
  'ONBOARDING_TOGGLE_BASIC_FUNCTIONALITY_OFF';

// remote state
export const UPDATE_METAMASK_STATE = 'UPDATE_METAMASK_STATE';
export const SELECTED_ADDRESS_CHANGED = 'SELECTED_ADDRESS_CHANGED';
export const SELECTED_ACCOUNT_CHANGED = 'SELECTED_ACCOUNT_CHANGED';
export const ACCOUNT_CHANGED = 'ACCOUNT_CHANGED';
export const CHAIN_CHANGED = 'CHAIN_CHANGED';
export const ADDRESS_BOOK_UPDATED = 'ADDRESS_BOOK_UPDATED';
export const GAS_FEE_ESTIMATES_UPDATED = 'GAS_FEE_ESTIMATES_UPDATED';
export const CLOSE_WELCOME_SCREEN = 'CLOSE_WELCOME_SCREEN';
// send state
export const CLEAR_SWAP_AND_SEND_STATE = 'CLEAR_SWAP_AND_SEND_STATE';
// unlock screen
export const UNLOCK_IN_PROGRESS = 'UNLOCK_IN_PROGRESS';
export const UNLOCK_FAILED = 'UNLOCK_FAILED';
export const UNLOCK_SUCCEEDED = 'UNLOCK_SUCCEEDED';
export const LOCK_METAMASK = 'LOCK_METAMASK';
// error handling
export const DISPLAY_WARNING = 'DISPLAY_WARNING';
export const HIDE_WARNING = 'HIDE_WARNING';
export const SHOW_SETTINGS_PAGE_ERROR = 'SHOW_SETTINGS_PAGE_ERROR';
export const HIDE_SETTINGS_PAGE_ERROR = 'HIDE_SETTINGS_PAGE_ERROR';
export const CAPTURE_SINGLE_EXCEPTION = 'CAPTURE_SINGLE_EXCEPTION';
// accounts screen
export const SHOW_ACCOUNTS_PAGE = 'SHOW_ACCOUNTS_PAGE';
export const SHOW_CONF_TX_PAGE = 'SHOW_CONF_TX_PAGE';
// account detail screen
export const SHOW_SEND_TOKEN_PAGE = 'SHOW_SEND_TOKEN_PAGE';
export const SHOW_PRIVATE_KEY = 'SHOW_PRIVATE_KEY';
export const SET_ACCOUNT_LABEL = 'SET_ACCOUNT_LABEL';
export const CLEAR_ACCOUNT_DETAILS = 'CLEAR_ACCOUNT_DETAILS';
export const SET_ACCOUNT_DETAILS_ADDRESS = 'SET_ACCOUNT_DETAILS_ADDRESS';
// tx conf screen
export const COMPLETED_TX = 'COMPLETED_TX';
export const TRANSACTION_ERROR = 'TRANSACTION_ERROR';
export const UPDATE_TRANSACTION_PARAMS = 'UPDATE_TRANSACTION_PARAMS';
export const SET_NEXT_NONCE = 'SET_NEXT_NONCE';
// config screen
export const SET_HARDWARE_WALLET_DEFAULT_HD_PATH =
  'SET_HARDWARE_WALLET_DEFAULT_HD_PATH';
// loading overlay
export const SHOW_LOADING = 'SHOW_LOADING_INDICATION';
export const HIDE_LOADING = 'HIDE_LOADING_INDICATION';

// Nft still fetching indication spinners
export const SHOW_NFT_STILL_FETCHING_INDICATION =
  'SHOW_NFT_STILL_FETCHING_INDICATION';
export const HIDE_NFT_STILL_FETCHING_INDICATION =
  'HIDE_NFT_STILL_FETCHING_INDICATION';

export const SHOW_NFT_DETECTION_ENABLEMENT_TOAST =
  'SHOW_NFT_DETECTION_ENABLEMENT_TOAST';

export const TOGGLE_ACCOUNT_MENU = 'TOGGLE_ACCOUNT_MENU';
export const TOGGLE_NETWORK_MENU = 'TOGGLE_NETWORK_MENU';
export const SET_SELECTED_ACCOUNTS_FOR_DAPP_CONNECTIONS =
  'SET_SELECTED_ACCOUNTS_FOR_DAPP_CONNECTIONS';
export const SET_SELECTED_NETWORKS_FOR_DAPP_CONNECTIONS =
  'SET_SELECTED_NETWORKS_FOR_DAPP_CONNECTIONS';

// deprecated network modal
export const DEPRECATED_NETWORK_POPOVER_OPEN =
  'DEPRECATED_NETWORK_POPOVER_OPEN';
export const DEPRECATED_NETWORK_POPOVER_CLOSE =
  'DEPRECATED_NETWORK_POPOVER_CLOSE';

// preferences
export const UPDATE_CUSTOM_NONCE = 'UPDATE_CUSTOM_NONCE';

export const SET_PARTICIPATE_IN_METAMETRICS = 'SET_PARTICIPATE_IN_METAMETRICS';
export const SET_DATA_COLLECTION_FOR_MARKETING =
  'SET_DATA_COLLECTION_FOR_MARKETING';
export const DELETE_METAMETRICS_DATA_MODAL_OPEN =
  'DELETE_METAMETRICS_DATA_MODAL_OPEN';
export const DELETE_METAMETRICS_DATA_MODAL_CLOSE =
  'DELETE_METAMETRICS_DATA_MODAL_CLOSE';
export const DATA_DELETION_ERROR_MODAL_OPEN =
  'DELETE_METAMETRICS_DATA_ERROR_MODAL_OPEN';
export const DATA_DELETION_ERROR_MODAL_CLOSE =
  'DELETE_METAMETRICS_DATA_ERROR_MODAL_CLOSE';

// locale
export const SET_CURRENT_LOCALE = 'SET_CURRENT_LOCALE';

// Onboarding

export const COMPLETE_ONBOARDING = 'COMPLETE_ONBOARDING';
export const RESET_ONBOARDING = 'RESET_ONBOARDING';
export const ONBOARDED_IN_THIS_UI_SESSION = 'ONBOARDED_IN_THIS_UI_SESSION';

// social login onboarding
export const RESET_SOCIAL_LOGIN_ONBOARDING = 'RESET_SOCIAL_LOGIN_ONBOARDING';

// Ledger

export const SET_WEBHID_CONNECTED_STATUS = 'SET_WEBHID_CONNECTED_STATUS';
export const SET_LEDGER_TRANSPORT_STATUS = 'SET_LEDGER_TRANSPORT_STATUS';

// Network
export const SET_PENDING_TOKENS = 'SET_PENDING_TOKENS';
export const CLEAR_PENDING_TOKENS = 'CLEAR_PENDING_TOKENS';

export const SET_FIRST_TIME_FLOW_TYPE = 'SET_FIRST_TIME_FLOW_TYPE';

export const SET_SELECTED_NETWORK_CONFIGURATION_ID =
  'SET_SELECTED_NETWORK_CONFIGURATION_ID';
export const SET_NEW_NETWORK_ADDED = 'SET_NEW_NETWORK_ADDED';
export const SET_EDIT_NETWORK = 'SET_EDIT_NETWORK';

export const SET_NEW_NFT_ADDED_MESSAGE = 'SET_NEW_NFT_ADDED_MESSAGE';
export const SET_REMOVE_NFT_MESSAGE = 'SET_REMOVE_NFT_MESSAGE';

export const LOADING_METHOD_DATA_STARTED = 'LOADING_METHOD_DATA_STARTED';
export const LOADING_METHOD_DATA_FINISHED = 'LOADING_METHOD_DATA_FINISHED';

export const SET_REQUEST_ACCOUNT_TABS = 'SET_REQUEST_ACCOUNT_TABS';
export const SET_OPEN_METAMASK_TAB_IDS = 'SET_OPEN_METAMASK_TAB_IDS';

// Home Screen
export const HIDE_WHATS_NEW_POPUP = 'HIDE_WHATS_NEW_POPUP';
export const TOGGLE_GAS_LOADING_ANIMATION = 'TOGGLE_GAS_LOADING_ANIMATION';

// Smart Transactions
export const SET_SMART_TRANSACTIONS_ERROR = 'SET_SMART_TRANSACTIONS_ERROR';
export const DISMISS_SMART_TRANSACTIONS_ERROR_MESSAGE =
  'DISMISS_SMART_TRANSACTIONS_ERROR_MESSAGE';

export const TOGGLE_CURRENCY_INPUT_SWITCH = 'TOGGLE_CURRENCY_INPUT_SWITCH';

// Token detection v2
export const SET_NEW_TOKENS_IMPORTED = 'SET_NEW_TOKENS_IMPORTED';

export const SET_NEW_TOKENS_IMPORTED_ERROR = 'SET_NEW_TOKENS_IMPORTED_ERROR';

// Token allowance
export const SET_CUSTOM_TOKEN_AMOUNT = 'SET_CUSTOM_TOKEN_AMOUNT';

// Connections Modal
export const CONNECT_ACCOUNTS_MODAL_OPEN = 'UI_CONNECT_ACCOUNTS_MODAL_OPEN';
export const CONNECT_ACCOUNTS_MODAL_CLOSE = 'UI_CONNECT_ACCOUNTS_MODAL_CLOSE';

///: BEGIN:ONLY_INCLUDE_IF(keyring-snaps)
export const SHOW_KEYRING_SNAP_REMOVAL_RESULT =
  'SHOW_KEYRING_SNAP_REMOVAL_RESULT';
export const HIDE_KEYRING_SNAP_REMOVAL_RESULT =
  'HIDE_KEYRING_SNAP_REMOVAL_RESULT';
///: END:ONLY_INCLUDE_IF

export const SET_SHOW_NFT_AUTO_DETECT_MODAL_UPGRADE =
  'SET_SHOW_NFT_AUTO_DETECT_MODAL_UPGRADE';

export const TOKEN_SORT_CRITERIA = 'TOKEN_SORT_CRITERIA';
export const SET_SLIDES = 'SET_SLIDES';

export const SET_SHOW_NEW_SRP_ADDED_TOAST = 'SET_SHOW_NEW_SRP_ADDED_TOAST';

export const SET_SHOW_PASSWORD_CHANGE_TOAST = 'SET_SHOW_PASSWORD_CHANGE_TOAST';

export const SET_SHOW_COPY_ADDRESS_TOAST = 'SET_SHOW_COPY_ADDRESS_TOAST';

export const SET_SHOW_SUPPORT_DATA_CONSENT_MODAL =
  'SET_SHOW_SUPPORT_DATA_CONSENT_MODAL';

export const SET_SHOW_CONNECTIONS_REMOVED = 'SET_SHOW_CONNECTIONS_REMOVED';
