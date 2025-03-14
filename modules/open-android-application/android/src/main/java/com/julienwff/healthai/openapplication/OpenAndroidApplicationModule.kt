package com.julienwff.healthai.openapplication

import android.content.Context
import android.content.Intent
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class PackageNotFoundException(packageName: String) :
    Exception("Could not find application with package name: $packageName")

class OpenAndroidApplicationModule : Module() {
    private val context: Context
        get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

    override fun definition() = ModuleDefinition {
        Name("OpenAndroidApplication")

        Function("open") { packageName: String ->
            try {
                val launchIntent = context.packageManager.getLaunchIntentForPackage(packageName)
                    ?: throw PackageNotFoundException(packageName)

                // Add FLAG_ACTIVITY_NEW_TASK for launching from a non-activity context
                launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                context.startActivity(launchIntent)
                true
            } catch (e: Exception) {
                throw PackageNotFoundException(packageName)
            }
        }
    }
}
