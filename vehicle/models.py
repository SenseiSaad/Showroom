from django.db import models


class Brand(models.Model):
    name = models.CharField(max_length=50)
    country = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name


class Vehicle(models.Model):
    brand = models.ForeignKey(Brand,on_delete=models.CASCADE,related_name="vehicles")

    category = models.ForeignKey(Category,on_delete=models.CASCADE,related_name="vehicles")

    name = models.CharField(max_length=100)
    price=models.DecimalField(max_digits=10, decimal_places=2)
    fuel_type = models.CharField(max_length=20)
    transmission = models.CharField(max_length=20)
    top_speed = models.PositiveIntegerField()
    horsepower = models.PositiveIntegerField()
    country_of_origin = models.CharField(max_length=50)
    year = models.PositiveIntegerField()
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name