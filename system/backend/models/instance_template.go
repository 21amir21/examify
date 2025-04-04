package models

// InstanceTemplate represents a VM template for exam instances
type InstanceTemplate struct {
	Name              string   `bson:"name" json:"name"`
	OS                string   `bson:"os" json:"os"`
	InstalledSoftware []string `bson:"installedSoftware" json:"installedSoftware"`
	Description       string   `bson:"description" json:"description"`
}
