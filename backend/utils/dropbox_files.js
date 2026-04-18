const { Dropbox } = require('dropbox')
const fetch = require('node-fetch')

const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN,
  fetch
})

// Obtener ficheros
async function getAllFiles(path = '') {
  let res = await dbx.filesListFolder({ path })
  let files = res.result.entries

  while (res.result.has_more) {
    res = await dbx.filesListFolderContinue({
      cursor: res.result.cursor
    })
    files = files.concat(res.result.entries)
  }

  return files
}


async function getLink(filePath) {
  try {
    const res = await dbx.sharingCreateSharedLinkWithSettings({
      path: filePath
    })

    return res.result.url.replace('?dl=0', '?dl=1')

  } catch (e) {
    // Si enlace ya existe
    if (e.error?.error_summary?.includes('shared_link_already_exists')) {
      const links = await dbx.sharingListSharedLinks({ path: filePath })
      return links.result.links[0].url.replace('?dl=0', '?dl=1')
    }
  }
}

// Cargar a MongoDB
for (const doc of docsFromMongo) {
  const dropboxPath = doc.path

  const url = await getLink(dropboxPath)

  await collection.updateOne(
    { _id: doc._id },
    { $set: { dropbox_url: url } }
  )

  console.log('OK:', dropboxPath)
}