import { RadioDto } from "../DTO/radioDTO";

export interface BrandApiModel {
  id: string;
  title: string;
  baseline?: string;
  description?: string;
  websiteUrl?: string;
  liveStream?: string;
  playerUrl?: string;
  webRadios?: RadioDto[];
  localRadios?: RadioDto[];
}