import org.koin.java.KoinJavaComponent.get
import org.koin.java.KoinJavaComponent.inject

object KoinExtension {
    inline fun <reified T: Any> component(): T = get(T::class.java)
    inline fun <reified T: Any> delegate(): Lazy<T> = inject(T::class.java)
}