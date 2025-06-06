package terraform

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os/exec"
	"strings"
)

type TFOutput map[string]TFOutputValue

type TFOutputValue struct {
	Sensitive bool `json:"sensitive"`
	Type      any  `json:"type"`
	Value     any  `json:"value"`
}

type TerraformRunner struct {
	Dir string
}

type TFVariable struct {
	Name  string `json:"name"`
	Value any    `json:"value"`
}

// NewTerraformRunner is a constructor for TerraformRunner
func NewTerraformRunner(dir string) *TerraformRunner {
	return &TerraformRunner{
		Dir: dir,
	}
}

func (t *TerraformRunner) workspaceExists(name string) (bool, error) {
	cmd := exec.Command("terraform", "-chdir="+t.Dir, "workspace", "list")
	output, err := cmd.Output()
	if err != nil {
		return false, err
	}
	return strings.Contains(string(output), name), nil
}

func (t *TerraformRunner) createWorkspace(name string) error {
	cmd := exec.Command("terraform", "-chdir="+t.Dir, "workspace", "new", name)
	return cmd.Run()
}

func (t *TerraformRunner) selectWorkspace(name string) error {
	cmd := exec.Command("terraform", "-chdir="+t.Dir, "workspace", "select", name)
	return cmd.Run()
}

func (t *TerraformRunner) apply(vars []TFVariable) (TFOutput, error) {
	args := []string{"-chdir=" + t.Dir, "apply", "-auto-approve"}
	for _, v := range vars {
		args = append(args, fmt.Sprintf("-var=%s=%v", v.Name, v.Value))
	}

	cmd := exec.Command("terraform", args...)

	var stdoutBuf, stderrBuf bytes.Buffer
	cmd.Stdout = &stdoutBuf
	cmd.Stderr = &stderrBuf

	err := cmd.Run()

	if err != nil {
		// Log both stdout and stderr clearly
		fmt.Println("Terraform apply failed")
		fmt.Println("STDOUT:\n" + stdoutBuf.String())
		fmt.Println("STDERR:\n" + stderrBuf.String())
		return nil, fmt.Errorf("terraform apply failed: %w", err)
	}

	// After a successful apply, run terraform output -json to get structured output
	outputCmd := exec.Command("terraform", "-chdir="+t.Dir, "output", "-json")

	var outBuf bytes.Buffer
	outputCmd.Stdout = &outBuf
	outputCmd.Stderr = &stderrBuf // reuse the same buffer for capturing output errors

	if err := outputCmd.Run(); err != nil {
		fmt.Println("Failed to fetch terraform outputs")
		fmt.Println("STDOUT:\n" + outBuf.String())
		fmt.Println("STDERR:\n" + stderrBuf.String())
		return nil, fmt.Errorf("terraform output failed: %w", err)
	}

	var tfOutput TFOutput
	if err := json.Unmarshal(outBuf.Bytes(), &tfOutput); err != nil {
		return nil, fmt.Errorf("failed to parse terraform outputs: %w", err)
	}

	return tfOutput, nil
}

func (t *TerraformRunner) CreateInfrastructure(workspace string, vars []TFVariable) (TFOutput, error) {
	exists, err := t.workspaceExists(workspace)
	if err != nil {
		return nil, err
	}

	if exists {
		err = t.selectWorkspace(workspace)
	} else {
		err = t.createWorkspace(workspace)
	}
	if err != nil {
		return nil, err
	}

	return t.apply(vars)
}
