import { Orders } from '@/utils/alwaysData';

export const checkDuplicatedAddress = (orders: Orders[]): Set<string> => {
    const duplicatedAddresses = new Set<string>();  // 중복된 주소를 담을 Set
    const addressCount: Record<string, number> = {};  // 주소 카운팅을 위한 객체

    // 주소에 포함된 "시", "도", "구", "동" 등의 구분자가 두 번 이상 나오면 중복으로 처리
    const checkForRepeatedParts = (address: string): boolean => {
        // "시", "도", "구", "동" 등의 단어가 두 번 이상 나오면 중복으로 처리
        const regex = /(\b[가-힣]+(시|도|구|동)\b)/g;  // "시", "도", "구", "동"을 찾는 정규식
        const matches = address.match(regex);  // 해당 패턴에 맞는 부분을 찾음

        if (matches && matches.length > 1) {
            return true;  // 두 번 이상 반복되면 중복
        }
        return false;  // 그렇지 않으면 중복 아님
    };

    const normalizeAddress = (address: string): string => {
        // 공백 제거, 특수문자 제거, 대소문자 무시하고 처리
        return address
            .replace(/\s+/g, '')  // 공백 제거
            .replace(/[^\w가-힣0-9]/g, '')  // 한글과 숫자만 남기고 특수문자 제거
            .toLowerCase();  // 대소문자 구분 없애기
    };

    orders.forEach((order) => {
        const address = order.주소 || "";

        if (checkForRepeatedParts(address)) {
            duplicatedAddresses.add(address);  // 중복 주소가 발견되면 Set에 추가
        }

        // 주소를 카운팅하여 중복 여부를 확인
        const normalizedAddress = normalizeAddress(address);
        addressCount[normalizedAddress] = (addressCount[normalizedAddress] || 0) + 1;

        // 동일한 주소가 여러 번 있으면 중복 처리
        if (addressCount[normalizedAddress] > 1) {
            duplicatedAddresses.add(normalizedAddress);
        }
    });

    return duplicatedAddresses;  // 중복된 주소들을 반환
};

