import { nanoid } from 'nanoid';
import Url from '../models/Url.js';

function buildShortUrl(req, code) {
  const host = req.get('host');
  const protocol = req.protocol;
  return `${protocol}://${host}/${code}`;
}

export async function createShortLink(req, res) {
  try {
    const { url } = req.body || {};
    const longUrl = url;

    if (!longUrl) {
      return res.status(400).json({
        error: 'Original_URL is required',
        details: 'Provide { Original_URL } or { url } in JSON body.',
      });
    }

    // Basic URL validation
    try {
      // eslint-disable-next-line no-new
      new URL(longUrl);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Ensure unique Short_Code
    let code = nanoid(6);
    let attempts = 0;
    // Regenerate if collision, up to a few attempts
    // (mongoose unique index will also enforce at DB level)
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const exists = await Url.exists({ Short_Code: code });
      if (!exists) break;
      code = nanoid(6);
      attempts += 1;
      if (attempts > 5) {
        return res
          .status(503)
          .json({ error: 'Could not generate unique code' });
      }
    }

    const doc = await Url.create({
      Original_URL: longUrl,
      Short_Code: code,
    });

    const shortUrl = buildShortUrl(req, doc.Short_Code);
    return res.status(201).json({
      shortCode: doc.Short_Code,
      shortUrl, // The new Zeta-link
      originalUrl: doc.Original_URL,
      createdAt: doc.Created_At,
    });
  } catch (err) {
    const status = err?.code === 11000 ? 409 : 500; // duplicate key -> conflict
    return res
      .status(status)
      .json({ error: 'Server error', message: err.message });
  }
}

export async function redirectByCode(req, res) {
  try {
    const { code } = req.params;
    const doc = await Url.findOneAndUpdate(
      { Short_Code: code },
      { $inc: { Click_Count: 1 } },
      { new: true },
    );

    if (!doc) {
      return res.status(404).json({ error: 'Link not found' });
    }

    return res.redirect(doc.Original_URL);
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Server error', message: err.message });
  }
}
