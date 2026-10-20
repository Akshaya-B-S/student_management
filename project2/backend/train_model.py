import pandas as pd
import joblib
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import OneHotEncoder

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_squared_error, r2_score
df = pd.read_csv("D:/projects/project2/dataset/StudentsPerformance.csv")


cols = ['gender', 'race/ethnicity', 'parental level of education', 'lunch',
       'test preparation course']
df = pd.get_dummies(df, columns = cols, drop_first = True)
X= df.drop(['math score'], axis = 1)
y = df['math score']

x_train, x_test,y_train, y_test = train_test_split(X,y, test_size = 0.2, random_state = 43)
model = LinearRegression()
model.fit(x_train, y_train)
y_pred = model.predict(x_test)

print(mean_squared_error(y_test,y_pred))
print(r2_score(y_test,y_pred))


# Save the trained model
joblib.dump(model, "model.pkl")

# Save the feature columns used during training
joblib.dump(X.columns.tolist(), "model_columns.pkl")