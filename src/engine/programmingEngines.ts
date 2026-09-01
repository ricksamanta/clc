/**
 * Deterministic Computer Science and Programming Calculators
 * Implements Base conversions, Bitwise arithmetic, IPv4 Subnet CIDR analysis, and Data representation.
 */

import { CalculationResult, CalculationStep } from '../types';

export function calculateBaseConversion(valueStr: string, fromBase: number, toBase: number): CalculationResult {
  const cleanInput = valueStr.trim();
  if (!cleanInput) {
    return {
      status: 'error',
      value: 'Empty input',
      warnings: ['Please enter a valid numeric representation.']
    };
  }

  if (fromBase < 2 || fromBase > 36 || toBase < 2 || toBase > 36) {
    return {
      status: 'error',
      value: 'Invalid Base',
      warnings: ['Bases must be integers between 2 and 36.']
    };
  }

  try {
    // Parse integer from base
    const decimalValue = parseInt(cleanInput, fromBase);
    if (isNaN(decimalValue)) {
      return {
        status: 'error',
        value: 'Invalid digits for base',
        warnings: [`"${cleanInput}" contains invalid characters for base ${fromBase}.`]
      };
    }

    const converted = decimalValue.toString(toBase).toUpperCase();
    const binaryRep = decimalValue.toString(2).padStart(8, '0');
    const hexRep = decimalValue.toString(16).toUpperCase().padStart(2, '0');
    const octalRep = decimalValue.toString(8);

    const steps: CalculationStep[] = [
      {
        title: `Convert Base ${fromBase} to Decimal (Base 10)`,
        detail: `Using positional polynomial expansion with base powers:`,
        math: `${cleanInput}_{${fromBase}} = \\sum d_i \\times ${fromBase}^i = ${decimalValue}_{10}`
      },
      {
        title: `Convert Decimal (${decimalValue}) to Base ${toBase}`,
        detail: `Successive integer division by target radix ${toBase} and collecting remainders in reverse:`,
        math: `${decimalValue}_{10} = ${converted}_{${toBase}}`
      },
      {
        title: 'Common Computer Number System Representations',
        detail: `Binary (Base 2): ${binaryRep}\nOctal (Base 8): ${octalRep}\nDecimal (Base 10): ${decimalValue}\nHexadecimal (Base 16): 0x${hexRep}`,
        math: `\\text{BIN}: ${binaryRep}_2, \\quad \\text{OCT}: ${octalRep}_8, \\quad \\text{HEX}: ${hexRep}_{16}`
      }
    ];

    return {
      status: 'success',
      value: converted,
      exactResult: `${converted} (Base ${toBase})`,
      formula: `N = \\sum_{i=0}^{k} d_i \\cdot \\text{Base}^i`,
      steps,
      verification: {
        statement: `Round-Trip Base Inversion Check`,
        passed: parseInt(converted, toBase) === decimalValue,
        details: `Converting "${converted}" back from Base ${toBase} yields ${decimalValue}_{10}. Perfect match!`
      },
      explanation: {
        what: `Converts numbers between positional radix systems (Binary, Octal, Decimal, Hexadecimal, Base 2-36).`,
        why: `Computers store data natively in binary transistors (0 and 1); Hexadecimal is used by engineers as a compact human-readable byte shorthand (4 bits per hex digit).`,
        whenToUse: `Low-level programming, memory addresses, color codes (#RRGGBB), network packet analysis.`,
        commonMistakes: [`Forgetting that Hex digits A-F correspond to decimal 10-15.`]
      }
    };
  } catch (err: any) {
    return {
      status: 'error',
      value: 'Conversion Error',
      warnings: [err?.message || 'Invalid conversion input']
    };
  }
}

// --- PROGRAMMING: BITWISE OPERATIONS ---
export function calculateBitwise(a: number, b: number, op: 'AND' | 'OR' | 'XOR' | 'NOT' | 'SHL' | 'SHR'): CalculationResult {
  const intA = Math.floor(a);
  const intB = Math.floor(b);
  let res = 0;
  let symbol = '';

  switch (op) {
    case 'AND':
      res = intA & intB;
      symbol = '&';
      break;
    case 'OR':
      res = intA | intB;
      symbol = '|';
      break;
    case 'XOR':
      res = intA ^ intB;
      symbol = '^';
      break;
    case 'NOT':
      res = ~intA;
      symbol = '~';
      break;
    case 'SHL':
      res = intA << (intB & 0x1f);
      symbol = '<<';
      break;
    case 'SHR':
      res = intA >> (intB & 0x1f);
      symbol = '>>';
      break;
  }

  const binA = (intA >>> 0).toString(2).padStart(16, '0');
  const binB = (intB >>> 0).toString(2).padStart(16, '0');
  const binRes = (res >>> 0).toString(2).padStart(16, '0');

  const steps: CalculationStep[] = [
    {
      title: 'Convert Operands to Binary Words (32-bit unsigned representation)',
      detail: `Operand A: ${intA} = 0b${binA}\nOperand B: ${intB} = 0b${binB}`,
      math: `A = ${binA}_2, \\quad B = ${binB}_2`
    },
    {
      title: `Apply Bitwise ${op} (${symbol}) Truth Table Bit-by-Bit`,
      detail: `Performing logical bit-parallel operation across every column position:`,
      math: `\\begin{array}{r@{\\quad}l} & ${binA} \\\\ ${symbol} & ${binB} \\\\ \\hline & ${binRes} \\end{array}`
    },
    {
      title: 'Final Decimal & Hexadecimal Value',
      detail: `Decimal: ${res}, Hex: 0x${(res >>> 0).toString(16).toUpperCase()}`,
      math: `\\text{Result} = ${res} \\quad (\\text{0x}${(res >>> 0).toString(16).toUpperCase()})`
    }
  ];

  return {
    status: 'success',
    value: `${res} (0b${binRes.slice(-8)})`,
    exactResult: `${res}`,
    formula: `\\text{Result} = A \\ ${symbol} \\ B`,
    steps,
    explanation: {
      what: `Bitwise operations manipulate individual binary bits directly inside hardware ALU registers.`,
      why: `Bitwise operators execute in a single CPU clock cycle and are foundational for flags, masks, cryptography, and network subnetting.`,
      whenToUse: `Graphics shaders, hardware communication, cryptography algorithms (AES/SHA), high-performance bit-flags.`,
      commonMistakes: [`Confusing logical operators (&&, ||) with bitwise operators (&, |).`]
    }
  };
}

// --- PROGRAMMING: IPv4 SUBNET / CIDR CALCULATOR ---
export function calculateSubnet(ipStr: string, prefixLen: number): CalculationResult {
  const parts = ipStr.trim().split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255) || prefixLen < 0 || prefixLen > 32) {
    return {
      status: 'error',
      value: 'Invalid IPv4 or CIDR prefix',
      warnings: ['IPv4 address must be 4 octets (0-255) and CIDR prefix between 0 and 32 (e.g. 192.168.1.1/24).']
    };
  }

  // Calculate 32-bit integer representation of IP
  const ipInt = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];

  // Netmask integer
  const maskInt = prefixLen === 0 ? 0 : (~0 << (32 - prefixLen));

  const networkInt = ipInt & maskInt;
  const broadcastInt = networkInt | ~maskInt;

  const intToIp = (val: number): string => {
    return [
      (val >>> 24) & 255,
      (val >>> 16) & 255,
      (val >>> 8) & 255,
      val & 255
    ].join('.');
  };

  const netmaskStr = intToIp(maskInt);
  const networkStr = intToIp(networkInt);
  const broadcastStr = intToIp(broadcastInt);
  const wildcardStr = intToIp(~maskInt);

  const totalHosts = prefixLen >= 31 ? (prefixLen === 32 ? 1 : 2) : Math.pow(2, 32 - prefixLen);
  const usableHosts = prefixLen >= 31 ? (prefixLen === 31 ? 2 : 1) : Math.max(0, totalHosts - 2);

  const firstHostStr = prefixLen >= 31 ? networkStr : intToIp(networkInt + 1);
  const lastHostStr = prefixLen >= 31 ? broadcastStr : intToIp(broadcastInt - 1);

  const steps: CalculationStep[] = [
    {
      title: 'Determine Subnet Mask & Wildcard Mask',
      detail: `Prefix /${prefixLen} corresponds to ${prefixLen} contiguous binary 1s followed by ${32 - prefixLen} zeros.`,
      math: `\\text{Netmask} = ${netmaskStr}, \\quad \\text{Wildcard} = ${wildcardStr}`
    },
    {
      title: 'Calculate Network Address (IP & Mask)',
      detail: `Bitwise AND between IPv4 address and netmask isolates the network wire prefix:`,
      math: `${ipStr} \\ \\& \\ ${netmaskStr} = ${networkStr}`
    },
    {
      title: 'Calculate Broadcast Address (Network | ~Mask)',
      detail: `Setting all host bits to 1 yields the subnet broadcast address:`,
      math: `${networkStr} \\ | \\ ${wildcardStr} = ${broadcastStr}`
    },
    {
      title: 'Usable Host Range & Capacity',
      detail: `First Host: ${firstHostStr}\nLast Host: ${lastHostStr}\nTotal Addresses: ${totalHosts.toLocaleString()}\nUsable Host Devices: ${usableHosts.toLocaleString()}`,
      math: `\\text{Usable Hosts} = 2^{32-${prefixLen}} - 2 = ${usableHosts.toLocaleString()}`
    }
  ];

  return {
    status: 'success',
    value: `${networkStr}/${prefixLen}`,
    unit: `${usableHosts.toLocaleString()} usable hosts`,
    exactResult: `Network: ${networkStr}, Broadcast: ${broadcastStr}`,
    formula: `\\text{Network} = \\text{IP} \\ \\& \\ \\text{Mask}; \\quad \\text{Broadcast} = \\text{Network} \\ | \\ \\overline{\\text{Mask}}`,
    steps,
    explanation: {
      what: `Classless Inter-Domain Routing (CIDR) subnetting divides an IPv4 network into logical broadcast domains.`,
      why: `Conserves IPv4 address space and reduces routing table size via hierarchical routing aggregation.`,
      whenToUse: `Configuring routers, VPC cloud networks (AWS/GCP), firewall rules, DHCP pools.`,
      commonMistakes: [`Assigning network address or broadcast address to an individual host machine (these are reserved in standard subnets).`]
    },
    chartData: {
      network: networkStr,
      broadcast: broadcastStr,
      netmask: netmaskStr,
      firstHost: firstHostStr,
      lastHost: lastHostStr,
      usableHosts: usableHosts,
      totalHosts: totalHosts
    }
  };
}
