import assert from "assert";
import {
  dedupeLinksByTimeKey,
  PENDING_LINK_PARENT_ID,
  dedupePendingLinks,
  hasMovedPendingLinks,
  normalizePendingLinkUrl,
} from "./pendingLinks.mjs";

assert.equal(normalizePendingLinkUrl(" https://example.com/a "), "https://example.com/a");
assert.equal(normalizePendingLinkUrl(null), "");

const links = [
  {
    linkId: 2,
    timeKey: "second",
    parentId: PENDING_LINK_PARENT_ID,
    url: "https://example.com/a",
    sort: 1,
  },
  {
    linkId: 1,
    timeKey: "first",
    parentId: PENDING_LINK_PARENT_ID,
    url: " https://example.com/a ",
    sort: 0,
  },
  {
    linkId: 3,
    timeKey: "query",
    parentId: PENDING_LINK_PARENT_ID,
    url: "https://example.com/a?x=1",
    sort: 2,
  },
  {
    linkId: 4,
    timeKey: "hash",
    parentId: PENDING_LINK_PARENT_ID,
    url: "https://example.com/a#section",
    sort: 3,
  },
];

const { uniqueLinks, duplicateLinks } = dedupePendingLinks(links);

assert.deepEqual(
  uniqueLinks.map((link) => link.timeKey),
  ["first", "query", "hash"]
);
assert.deepEqual(
  duplicateLinks.map((link) => link.timeKey),
  ["second"]
);

assert.equal(
  hasMovedPendingLinks(
    [
      { timeKey: "pending", parentId: PENDING_LINK_PARENT_ID },
      { timeKey: "moved", parentId: "group-1" },
      null,
    ],
    "group-1"
  ),
  true
);

assert.equal(
  hasMovedPendingLinks(
    [
      { timeKey: "pending", parentId: PENDING_LINK_PARENT_ID },
      { timeKey: "other", parentId: "group-2" },
    ],
    "group-1"
  ),
  false
);

assert.deepEqual(
  dedupeLinksByTimeKey([
    { timeKey: "same", title: "first" },
    { timeKey: "same", title: "second" },
    { title: "tab without timeKey 1" },
    { title: "tab without timeKey 2" },
    { timeKey: "other", title: "other" },
  ]).map((link) => link.title),
  ["first", "tab without timeKey 1", "tab without timeKey 2", "other"]
);
