import tensorflow as tf
x = tf.reshape(tf.range(12, dtype=tf.float32), (3, 4))
y = tf.reshape(tf.range(12, dtype=tf.float32), (3, 4))

print(x + y)
