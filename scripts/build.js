#!/usr/bin/env node

import { build } from 'vite'
import { copyFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const buildExtension = async () => {
  console.log('🚀 Building YouTube Audio Enhancer Extension...')
  
  try {
    // Build with Vite
    await build()
    
    // Copy manifest.json to dist
    console.log('📋 Copying manifest.json...')
    if (!existsSync('dist')) {
      await mkdir('dist', { recursive: true })
    }
    await copyFile('public/manifest.json', 'dist/manifest.json')
    
    // Copy icons if they exist
    console.log('🎨 Copying icons...')
    const iconSizes = ['16', '32', '48', '128']
    
    if (!existsSync('dist/icons')) {
      await mkdir('dist/icons', { recursive: true })
    }
    
    for (const size of iconSizes) {
      const iconPath = `public/icons/icon${size}.png`
      if (existsSync(iconPath)) {
        await copyFile(iconPath, `dist/icons/icon${size}.png`)
        console.log(`  ✓ Copied icon${size}.png`)
      } else {
        console.log(`  ⚠️  icon${size}.png not found - please create this icon`)
      }
    }
    
    console.log('✅ Extension built successfully!')
    console.log('📦 Ready to load in Chrome:')
    console.log('   1. Open chrome://extensions/')
    console.log('   2. Enable Developer mode')
    console.log('   3. Click "Load unpacked"')
    console.log('   4. Select the "dist" folder')
    
  } catch (error) {
    console.error('❌ Build failed:', error)
    process.exit(1)
  }
}

buildExtension()