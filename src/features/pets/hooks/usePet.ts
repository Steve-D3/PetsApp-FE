import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Pet } from "../types";
import petsApi from "../api/petsApi";

export const usePet = () => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();

  const fetchPet = useCallback(async () => {
    if (!petId) return;

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view pet details");
        navigate("/login");
        return;
      }

      const response = await petsApi.getPetById(Number(petId));
      setPet(response);
    } catch (err) {
      const error = err as Error;
      if (error.message.includes("No authentication token")) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
      } else {
        setError(`Failed to fetch pet: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [petId, navigate]);

  const updatePet = async (petData: Partial<Pet>) => {
    if (!petId) return null;

    try {
      setLoading(true);
      setError(null);

      const updatedPet = await petsApi.updatePet(Number(petId), petData);
      setPet(updatedPet);
      return updatedPet;
    } catch (err) {
      const error = err as Error;
      setError(`Failed to update pet: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePet = async () => {
    if (!petId) return false;

    try {
      setLoading(true);
      setError(null);

      await petsApi.deletePet(Number(petId));
      return true;
    } catch (err) {
      const error = err as Error;
      setError(`Failed to delete pet: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPet();
  }, [fetchPet]);

  return {
    pet,
    loading,
    error,
    refresh: fetchPet,
    updatePet,
    deletePet,
  };
};
