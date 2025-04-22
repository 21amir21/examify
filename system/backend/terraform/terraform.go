package terraform

import (
	"bufio"
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
	args := []string{"-chdir=" + t.Dir, "apply", "-auto-approve", "-json"}
	for _, v := range vars {
		args = append(args, fmt.Sprintf("-var=%s=%v", v.Name, v.Value))
	}

	cmd := exec.Command("terraform", args...)
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return nil, err
	}
	if err := cmd.Start(); err != nil {
		return nil, err
	}

	scanner := bufio.NewScanner(stdout)
	var output TFOutput

	for scanner.Scan() {
		line := scanner.Bytes()
		line = bytes.TrimSpace(line)
		if len(line) == 0 {
			continue
		}

		var msg map[string]any
		if err := json.Unmarshal(line, &msg); err != nil {
			continue // to skip bad lines
		}

		if msg["type"] == "outputs" {
			var outMsg struct {
				Outputs TFOutput `json:"outputs"`
			}
			if err := json.Unmarshal(line, &outMsg); err != nil {
				return nil, fmt.Errorf("faild to parse outputs: %w", err)
			}
			output = outMsg.Outputs
			break
		}
	}

	if err := cmd.Wait(); err != nil {
		return nil, err
	}

	if output == nil {
		return nil, fmt.Errorf("could not get terraform outputs")
	}

	return output, nil
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
