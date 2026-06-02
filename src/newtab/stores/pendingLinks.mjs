export const PENDING_LINK_PARENT_ID = "000000";

export const normalizePendingLinkUrl = (url) => {
  if (typeof url !== "string") {
    return "";
  }
  return url.trim();
};

const getSortValue = (link) => {
  if (Number.isFinite(link?.sort)) {
    return link.sort;
  }
  return Number.MAX_SAFE_INTEGER;
};

const getLinkIdValue = (link) => {
  if (Number.isFinite(link?.linkId)) {
    return link.linkId;
  }
  return Number.MAX_SAFE_INTEGER;
};

export const sortPendingLinks = (links = []) => {
  return [...links].sort((a, b) => {
    const sortDiff = getSortValue(a) - getSortValue(b);
    if (sortDiff !== 0) {
      return sortDiff;
    }

    const linkIdDiff = getLinkIdValue(a) - getLinkIdValue(b);
    if (linkIdDiff !== 0) {
      return linkIdDiff;
    }

    return String(a?.timeKey || "").localeCompare(String(b?.timeKey || ""));
  });
};

export const dedupePendingLinks = (links = []) => {
  const seenUrls = new Set();
  const uniqueLinks = [];
  const duplicateLinks = [];

  sortPendingLinks(links).forEach((link) => {
    const normalizedUrl = normalizePendingLinkUrl(link?.url);
    if (!normalizedUrl) {
      uniqueLinks.push(link);
      return;
    }

    if (seenUrls.has(normalizedUrl)) {
      duplicateLinks.push(link);
      return;
    }

    seenUrls.add(normalizedUrl);
    uniqueLinks.push({
      ...link,
      url: normalizedUrl,
    });
  });

  return {
    uniqueLinks,
    duplicateLinks,
  };
};

export const hasMovedPendingLinks = (links = [], parentId) => {
  if (!parentId) {
    return false;
  }

  return links.some((link) => {
    return link && link.parentId === parentId;
  });
};

export const dedupeLinksByTimeKey = (links = []) => {
  const seenTimeKeys = new Set();

  return links.filter((link) => {
    const timeKey = link?.timeKey;
    if (!timeKey) {
      return true;
    }
    if (seenTimeKeys.has(timeKey)) {
      return false;
    }
    seenTimeKeys.add(timeKey);
    return true;
  });
};
