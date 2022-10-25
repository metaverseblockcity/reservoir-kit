import React from 'react'

import {
  Flex,
  Box,
  Input,
  FormatCurrency,
  Text,
  FormatCryptoCurrency,
} from '../../primitives'

import { Marketplace } from '../../hooks/useMarketplaces'
import { Currency } from '../../types/Currency'
import { CryptoCurrencyIcon } from '../../primitives'

type MarketPlaceInputProps = {
  marketplace: Marketplace
  royalty?: number
  currency: Currency
  usdPrice?: number | null
  onChange: (e: any) => void
  onBlur: (e: any) => void
}

const MarketplacePriceInput = ({
  marketplace,
  royalty = 0,
  currency,
  usdPrice,
  onChange,
  onBlur,
  ...props
}: MarketPlaceInputProps) => {
  const marketplaceFeePercentage = (marketplace.fee?.percent || 0) / 100
  const royaltyPercentage = (royalty * 0.01) / 100
  const percentageProfit = 1 - marketplaceFeePercentage - royaltyPercentage
  let profit = percentageProfit * Number(marketplace.truePrice)

  return (
    <Flex {...props} align="center">
      <Box css={{ mr: '$2' }}>
        <img
          src={marketplace.imageUrl}
          style={{ height: 32, width: 32, borderRadius: 4 }}
        />
      </Box>
      <Flex align="center">
        <Box
          css={{
            width: 'auto',
            height: 20,
          }}
        >
          <CryptoCurrencyIcon
            css={{ height: 18 }}
            address={currency.contract}
          />
        </Box>

        <Text style="body1" color="subtle" css={{ ml: '$1', mr: '$4' }} as="p">
          {currency.symbol}
        </Text>
      </Flex>
      <Box css={{ flex: 1 }}>
        <Input
          type="number"
          value={marketplace.price}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="Enter a listing price"
        />
      </Box>
      <Flex direction="column" align="end" css={{ ml: '$3' }}>
        <FormatCryptoCurrency
          amount={profit}
          address={currency.contract}
          decimals={currency.decimals}
          textStyle="h6"
          logoWidth={18}
        />
        <FormatCurrency
          amount={profit * (usdPrice || 1000)}
          style="subtitle2"
          color="subtle"
        />
      </Flex>
    </Flex>
  )
}

export default MarketplacePriceInput
