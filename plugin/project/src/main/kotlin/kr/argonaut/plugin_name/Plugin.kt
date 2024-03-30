package kr.argonaut.plugin_name

import org.bukkit.plugin.java.JavaPlugin
import org.koin.core.context.startKoin

class Plugin: JavaPlugin() {
    override fun onEnable() {
        // Plugin startup logic
        saveDefaultConfig()
        initializeModules()
    }

    override fun onDisable() {
        // Plugin shutdown logic
        saveConfig()
    }
}

fun initializeModules() {
    startKoin {
        modules(appModule)
    }
}
