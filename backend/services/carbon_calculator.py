"""
Carbon Calculator Service
Calculates CO2 emissions for various activities
"""

from typing import Any
from datetime import datetime
from config.firestore import query_documents
import logging

logger = logging.getLogger(__name__)

class CarbonCalculator:
    """Service for calculating carbon emissions"""
    
    # Emission factors (kg CO2 per unit)
    EMISSION_FACTORS = {
        'transport': {
            'car_petrol': {'factor': 0.192, 'unit': 'km'},
            'car_diesel': {'factor': 0.171, 'unit': 'km'},
            'car_electric': {'factor': 0.053, 'unit': 'km'},
            'car_hybrid': {'factor': 0.109, 'unit': 'km'},
            'bus': {'factor': 0.089, 'unit': 'km'},
            'train': {'factor': 0.041, 'unit': 'km'},
            'subway': {'factor': 0.028, 'unit': 'km'},
            'bicycle': {'factor': 0.0, 'unit': 'km'},
            'walking': {'factor': 0.0, 'unit': 'km'},
            'motorcycle': {'factor': 0.113, 'unit': 'km'},
            'flight_short': {'factor': 0.255, 'unit': 'km'},
            'flight_long': {'factor': 0.195, 'unit': 'km'},
        },
        'food': {
            'beef': {'factor': 27.0, 'unit': 'kg'},
            'lamb': {'factor': 39.2, 'unit': 'kg'},
            'pork': {'factor': 12.1, 'unit': 'kg'},
            'chicken': {'factor': 6.9, 'unit': 'kg'},
            'fish': {'factor': 6.1, 'unit': 'kg'},
            'eggs': {'factor': 4.8, 'unit': 'kg'},
            'dairy_milk': {'factor': 1.9, 'unit': 'liter'},
            'cheese': {'factor': 13.5, 'unit': 'kg'},
            'plant_milk': {'factor': 0.9, 'unit': 'liter'},
            'vegetables': {'factor': 2.0, 'unit': 'kg'},
            'fruits': {'factor': 1.1, 'unit': 'kg'},
            'grains': {'factor': 2.5, 'unit': 'kg'},
            'nuts': {'factor': 2.3, 'unit': 'kg'},
        },
        'energy': {
            'electricity_grid': {'factor': 0.475, 'unit': 'kwh'},
            'electricity_renewable': {'factor': 0.0, 'unit': 'kwh'},
            'natural_gas': {'factor': 0.185, 'unit': 'kwh'},
            'heating_oil': {'factor': 0.247, 'unit': 'liter'},
            'propane': {'factor': 0.214, 'unit': 'kg'},
            'coal': {'factor': 0.340, 'unit': 'kg'},
        },
        'shopping': {
            'clothing_new': {'factor': 15.0, 'unit': 'item'},
            'clothing_secondhand': {'factor': 2.0, 'unit': 'item'},
            'electronics': {'factor': 50.0, 'unit': 'item'},
            'furniture': {'factor': 100.0, 'unit': 'item'},
            'books': {'factor': 1.0, 'unit': 'item'},
            'general': {'factor': 5.0, 'unit': 'item'},
        }
    }
    
    @staticmethod
    def calculate_emissions(category: str, activity_type: str, amount: float, unit: str | None = None) -> dict[str, Any]:
        """
        Calculate CO2 emissions for an activity
        
        Args:
            category: Activity category (transport, food, energy, shopping)
            activity_type: Specific activity type
            amount: Amount of activity
            unit: Unit of measurement (optional, uses default if not provided)
            
        Returns:
            Dictionary with emissions_kg and other details
        """
        try:
            # Get emission factor
            if category not in CarbonCalculator.EMISSION_FACTORS:
                raise ValueError(f"Invalid category: {category}")
            
            category_factors = CarbonCalculator.EMISSION_FACTORS[category]
            
            if activity_type not in category_factors:
                raise ValueError(f"Invalid activity type: {activity_type}")
            
            factor_data = category_factors[activity_type]
            emission_factor = float(factor_data['factor'])
            default_unit = str(factor_data['unit'])
            
            # Use provided unit or default
            used_unit = unit or default_unit
            
            # Calculate emissions
            emissions_kg = amount * emission_factor
            
            # Calculate equivalents for context
            equivalents = CarbonCalculator._calculate_equivalents(emissions_kg)
            
            return {
                'emissions_kg': round(emissions_kg, 2),
                'emission_factor': emission_factor,
                'amount': amount,
                'unit': used_unit,
                'category': category,
                'activity_type': activity_type,
                'equivalents': equivalents
            }
            
        except Exception as e:
            raise Exception(f"Error calculating emissions: {str(e)}")
    
    @staticmethod
    def _calculate_equivalents(emissions_kg: float) -> dict[str, float]:
        """
        Calculate relatable equivalents for CO2 emissions
        
        Args:
            emissions_kg: CO2 emissions in kg
            
        Returns:
            Dictionary with various equivalents
        """
        if emissions_kg == 0:
            return {
                'trees_needed': 0.0,
                'km_driven': 0.0,
                'flights_short': 0.0,
                'burgers': 0.0,
                'smartphone_charges': 0.0,
            }
        
        return {
            'trees_needed': round(emissions_kg / 20, 2),  # 1 tree absorbs ~20kg CO2/year
            'km_driven': round(emissions_kg / 0.192, 2),  # Average car emissions
            'flights_short': round(emissions_kg / 255, 3),  # Short-haul flight
            'burgers': round(emissions_kg / 2.7, 2),  # Beef burger
            'smartphone_charges': round(emissions_kg / 0.008, 0),  # Phone charge
        }
    
    @staticmethod
    def get_daily_total(user_id: str, date: str) -> float:
        """
        Get total emissions for a specific day
        
        Args:
            user_id: User ID
            date: Date in YYYY-MM-DD format
            
        Returns:
            Total emissions in kg CO2
        """
        try:
            activities = query_documents(
                'activity_logs',
                filters=[
                    ('user_id', '==', user_id),
                    ('date', '==', date)
                ]
            )
            
            total = sum(activity.get('emissions_kg', 0) for activity in activities)
            return round(total, 2)
            
        except Exception as e:
            logger.error(f"Error getting daily total: {e}")
            return 0.0
    
    @staticmethod
    def get_period_summary(user_id: str, start_date: str, end_date: str) -> dict[str, Any]:
        """
        Get emissions summary for a time period
        
        Args:
            user_id: User ID
            start_date: Start date in YYYY-MM-DD format
            end_date: End date in YYYY-MM-DD format
            
        Returns:
            Dictionary with summary statistics
        """
        try:
            activities = query_documents(
                'activity_logs',
                filters=[
                    ('user_id', '==', user_id),
                    ('date', '>=', start_date),
                    ('date', '<=', end_date)
                ]
            )
            
            # Calculate totals by category
            breakdown = {
                'transport': 0,
                'food': 0,
                'energy': 0,
                'shopping': 0
            }
            
            total_emissions = 0
            
            for activity in activities:
                emissions = activity.get('emissions_kg', 0)
                category = activity.get('category', 'other')
                
                if category in breakdown:
                    breakdown[category] += emissions
                
                total_emissions += emissions
            
            # Calculate number of days
            start = datetime.strptime(start_date, '%Y-%m-%d')
            end = datetime.strptime(end_date, '%Y-%m-%d')
            days = (end - start).days + 1
            
            return {
                'total_emissions': round(total_emissions, 2),
                'average_daily': round(total_emissions / days if days > 0 else 0, 2),
                'breakdown': {k: round(v, 2) for k, v in breakdown.items()},
                'days': days,
                'start_date': start_date,
                'end_date': end_date
            }
            
        except Exception as e:
            logger.error(f"Error getting period summary: {e}")
            return {
                'total_emissions': 0,
                'average_daily': 0,
                'breakdown': {},
                'days': 0
            }
    
    @staticmethod
    def compare_to_baseline(user_id: str, current_emissions: float) -> dict[str, Any]:
        """
        Compare current emissions to user's baseline
        
        Args:
            user_id: User ID
            current_emissions: Current emissions to compare
            
        Returns:
            Dictionary with comparison data
        """
        try:
            from config.firestore import get_document
            
            profile = get_document('user_profiles', user_id)
            
            if not profile:
                return {
                    'difference': 0,
                    'percentage_change': 0,
                    'status': 'no_baseline'
                }
            
            baseline = profile.get('baseline_emissions', 0)
            
            if baseline == 0:
                return {
                    'difference': 0,
                    'percentage_change': 0,
                    'status': 'no_baseline'
                }
            
            difference = current_emissions - baseline
            percentage_change = ((current_emissions - baseline) / baseline) * 100
            
            status = 'improved' if difference < 0 else 'increased' if difference > 0 else 'same'
            
            return {
                'baseline_emissions': round(baseline, 2),
                'current_emissions': round(current_emissions, 2),
                'difference': round(difference, 2),
                'percentage_change': round(percentage_change, 2),
                'status': status
            }
            
        except Exception as e:
            logger.error(f"Error comparing to baseline: {e}")
            return {
                'difference': 0,
                'percentage_change': 0,
                'status': 'error'
            }
