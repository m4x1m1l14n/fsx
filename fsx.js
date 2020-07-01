/**
 * This module is extending fs
 */
const fs = require( 'fs' );
const Path = require( 'path' );

function existsAsync( path )
{
	return new Promise( ( resolve ) =>
	{
		fs.exists( path, ( exists ) =>
		{
			resolve( exists );
		} );
	} );
}

/**
 * 
 * @param {String} path 
 * @param {Object|String} options Default null.
 */
function readFileAsync( path, options = null )
{
	return new Promise( ( resolve, reject ) =>
	{
		fs.readFile( path, options, ( error, data ) =>
		{
			if ( error )
			{
				reject( error );
			}
			else
			{
				resolve( data );
			}
		} );
	} );
}

function writeFileAsync( path, data, options = null )
{
	return new Promise( ( resolve, reject ) =>
	{
		fs.writeFile( path, data, options, ( error ) =>
		{
			if ( error )
			{
				reject( error );
			}
			else
			{
				resolve();
			}
		} );
	} );
}

function mkdirAsync( path, options = null )
{
	return new Promise( ( resolve, reject ) =>
	{
		fs.mkdir( path, options, ( error ) =>
		{
			if ( error )
			{
				reject( error );
			}
			else
			{
				resolve();
			}
		} );
	} );
}

function readdirAsync( path, options = null )
{
	return new Promise( ( resolve, reject ) =>
	{
		fs.readdir( path, options, ( error, files ) =>
		{
			if ( error )
			{
				reject( error );
			}
			else
			{
				resolve( files );
			}
		} );
	} );
}

function lstatAsync( path )
{
	return new Promise( ( resolve, reject ) =>
	{
		fs.lstat( path, ( error, stats ) =>
		{
			if ( error )
			{
				reject( error );
			}
			else
			{
				resolve( stats );
			}
		} );
	} );
}

function unlinkAsync( path )
{
	return new Promise( ( resolve, reject ) =>
	{
		fs.unlink( path, ( error ) =>
		{
			if ( error )
			{
				reject( error );
			}
			else
			{
				resolve();
			}
		} );
	} );
}

function rmdir( path )
{
	return new Promise( ( resolve ) =>
	{
		fs.rmdir( path, () =>
		{
			resolve();
		} );
	} );
}

/**
 * Recursively asynchronously removes directory with
 * all of its files and subfolders
 * 
 * @param {String} path Path to directory to remove
 */
async function rmdirAsync( path )
{
	const fileNames = await readdirAsync( path );

	const promises = [];

	for ( const fileName of fileNames )
	{
		const absolutePath = Path.join( path, fileName );

		const promise = lstatAsync( absolutePath )
			.then( async ( stats ) =>
			{
				if ( stats.isDirectory() )
				{
					await rmdirAsync( absolutePath );
				}
				else
				{
					await unlinkAsync( absolutePath );
				}
			} );

		promises.push( promise );
	}

	await Promise.all( promises );

	await rmdir( path );
}

function moveFileAsync( source, destination )
{
	return new Promise( ( resolve, reject ) =>
	{
		fs.rename( source, destination, ( error ) =>
		{
			if ( error )
			{
				reject( error );
			}
			else
			{
				resolve();
			}
		} );
	} );
}

module.exports =
{
	existsAsync,
	readFileAsync,
	writeFileAsync,
	mkdirAsync,
	readdirAsync,
	lstatAsync,
	rmdirAsync,
	moveFileAsync,
	unlinkAsync
};
