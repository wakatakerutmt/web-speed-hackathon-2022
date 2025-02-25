import React, { forwardRef, useCallback, useState } from "react";
import styled, { keyframes } from "styled-components";

import { Dialog } from "../../../../components/layouts/Dialog";
import { Spacer } from "../../../../components/layouts/Spacer";
import { Stack } from "../../../../components/layouts/Stack";
import { Heading } from "../../../../components/typographies/Heading";
import { useFetch } from "../../../../hooks/useFetch";
import { useMutation } from "../../../../hooks/useMutation";
import { Space } from "../../../../styles/variables";
import { jsonFetcher } from "../../../../utils/HttpUtils";

const CANCEL = "cancel";
const CHARGE = "charge";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;
const FadeIn = styled.div`
  animation: ${fadeIn} 1s;
`;

/**
 * @typedef Props
 * @type {object}
 */

/** @type {React.ForwardRefExoticComponent<{Props>} */
export const ChargeDialog = forwardRef(({ closeDialog, onComplete, showDialog }, ref) => {
  const [bankCode, setBankCode] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [amount, setAmount] = useState(0);
  const [zenginCode, setZenginCode] = useState(null);

  const handleOnFocusInput = useCallback(async () => {
    if (zenginCode === null) {
      const data = await jsonFetcher("/api/zenginCode");
      setZenginCode(data.zenginCode);
    }
  }, [zenginCode]);

  const clearForm = useCallback(() => {
    setBankCode("");
    setBranchCode("");
    setAccountNo("");
    setAmount(0);
    closeDialog();
  }, []);

  const [charge] = useMutation("/api/users/me/charge", {
    auth: true,
    method: "POST",
  });

  const handleCodeChange = useCallback((e) => {
    setBankCode(e.currentTarget.value);
    setBranchCode("");
  }, []);

  const handleBranchChange = useCallback((e) => {
    setBranchCode(e.currentTarget.value);
  }, []);

  const handleAccountNoChange = useCallback((e) => {
    setAccountNo(e.currentTarget.value);
  }, []);

  const handleAmountChange = useCallback((e) => {
    setAmount(parseInt(e.currentTarget.value, 10));
  }, []);

  const handleCloseDialog = useCallback(
    async (e) => {
      if (e.currentTarget.returnValue === CANCEL) {
        clearForm();
        return;
      }

      await charge({ accountNo, amount, bankCode, branchCode });
      clearForm();
      onComplete();
    },
    [charge, bankCode, branchCode, accountNo, amount, onComplete, clearForm],
  );

  let bankList = null;
  let bank = null;
  let branch = null;
  if (zenginCode != null) {
    bankList = Object.entries(zenginCode).map(([code, { name }]) => ({
      code,
      name,
    }));
    bank = zenginCode[bankCode];
    branch = bank?.branches[branchCode];
  }

  return (
    <Dialog ref={ref} onClose={handleCloseDialog}>
      {showDialog &&
      <section>
        <Heading as="h1">チャージ</Heading>

        <Spacer mt={Space * 2} />
        <form method="dialog">
          <Stack gap={Space * 1}>
            <label>
              銀行コード
              <input
                list="ChargeDialog-bank-list"
                onChange={handleCodeChange}
                onFocus={handleOnFocusInput}
                value={bankCode}
              />
            </label>

            <datalist id="ChargeDialog-bank-list">
              {bankList !== null &&
                bankList.map(({ code, name }) => (
                  <option key={code} value={code}>{`${name} (${code})`}</option>
                ))
              }
            </datalist>

            {bank != null && (
              <FadeIn>
                銀行名: {bank.name}銀行
              </FadeIn>
            )}

            <label>
              支店コード
              <input
                list="ChargeDialog-branch-list"
                onChange={handleBranchChange}
                value={branchCode}
              />
            </label>

            <datalist id="ChargeDialog-branch-list">
              {bank != null &&
                Object.values(bank.branches).map((branch) => (
                  <option key={branch.code} value={branch.code}>
                    {branch.name}
                  </option>
                ))}
            </datalist>

            {branch && (
              <FadeIn animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
                支店名: {branch.name}
              </FadeIn>
            )}

            <label>
              口座番号
              <input
                onChange={handleAccountNoChange}
                type="text"
                value={accountNo}
              />
            </label>

            <label>
              金額
              <input
                min={0}
                onChange={handleAmountChange}
                type="number"
                value={amount}
              />
              Yeen
            </label>

            <div>※実在する通貨がチャージされることはありません</div>

            <menu>
              <button value={CANCEL}>キャンセル</button>
              <button value={CHARGE}>チャージ</button>
            </menu>
          </Stack>
        </form>
      </section>
      }
    </Dialog>
  );
});

ChargeDialog.displayName = "ChargeDialog";
