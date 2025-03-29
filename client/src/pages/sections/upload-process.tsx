import { useState, useEffect } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { WandSparkles, Copy, Edit, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { ProcessingResult } from "@shared/schema";

export default function UploadProcessSection() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [enhancementEnabled, setEnhancementEnabled] = useState(true);
  const [spellCheckEnabled, setSpellCheckEnabled] = useState(true);
  const [layoutAnalysisEnabled, setLayoutAnalysisEnabled] = useState(true);
  const [ocrMode, setOcrMode] = useState("auto");
  const [outputFormat, setOutputFormat] = useState("txt");
  const [confidenceThreshold, setConfidenceThreshold] = useState(80);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [uploadedDocId, setUploadedDocId] = useState<number | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  // Handle file upload error
  const handleFileError = (error: string) => {
    toast({
      variant: "destructive",
      title: "File Upload Error",
      description: error,
    });
  };

  // Generate file preview for images
  useEffect(() => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreviewUrl(null);
    }
  }, [file]);

  // Upload document mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest(
        "POST",
        "/api/documents/upload",
        formData,
      );
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Document Uploaded",
        description: "Your document was successfully uploaded.",
      });
      setUploadedDocId(data.id);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description:
          error instanceof Error ? error.message : "Failed to upload document.",
      });
    },
  });

  // Process document mutation
  const processMutation = useMutation({
    mutationFn: async (docId: number) => {
      const response = await apiRequest(
        "POST",
        `/api/documents/${docId}/process`,
      );
      return response.json();
    },
    onSuccess: (data: ProcessingResult) => {
      setResult(data);
      toast({
        title: "Processing Complete",
        description: "Your document has been successfully processed.",
      });
      setProcessing(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Processing Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to process document.",
      });
      setProcessing(false);
    },
  });

  // Handle file change
  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    // Reset results when new file is selected
    setResult(null);
    setUploadedDocId(null);
  };

  // Handle process button click
  const handleProcess = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please select a file to process.",
      });
      return;
    }

    setProcessing(true);

    try {
      // First upload the document if not already uploaded
      if (!uploadedDocId) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("enhancementEnabled", enhancementEnabled.toString());
        formData.append("spellCheckEnabled", spellCheckEnabled.toString());
        formData.append(
          "layoutAnalysisEnabled",
          layoutAnalysisEnabled.toString(),
        );
        formData.append("ocrMode", ocrMode);
        formData.append("outputFormat", outputFormat);
        formData.append("confidenceThreshold", confidenceThreshold.toString());

        const uploadResult = await uploadMutation.mutateAsync(formData);
        setUploadedDocId(uploadResult.id);

        // Then process it
        await processMutation.mutateAsync(uploadResult.id);
      } else {
        // If already uploaded, just process it
        await processMutation.mutateAsync(uploadedDocId);
      }
    } catch (error) {
      console.error("Error in processing workflow:", error);
      setProcessing(false);
    }
  };

  // Handle copy text
  const handleCopyText = () => {
    if (result?.extractedText) {
      navigator.clipboard.writeText(result.extractedText);
      toast({
        title: "Text Copied",
        description: "The extracted text has been copied to clipboard.",
      });
    }
  };

  // Handle download
  const handleDownload = () => {
    if (!result?.extractedText) return;

    let mimeType, fileExtension;
    switch (outputFormat) {
      case "pdf":
        mimeType = "application/pdf";
        fileExtension = "pdf";
        break;
      case "json":
        mimeType = "application/json";
        fileExtension = "json";
        break;
      default:
        mimeType = "text/plain";
        fileExtension = "txt";
    }

    let content;
    if (outputFormat === "json") {
      content = JSON.stringify(
        {
          text: result.extractedText,
          metadata: {
            confidence: result.confidence,
            processingTime: result.processingTime,
            charCount: result.charCount,
          },
        },
        null,
        2,
      );
    } else {
      content = result.extractedText;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tamilocr_result.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: `Result file is being downloaded as ${fileExtension.toUpperCase()}.`,
    });
  };

  return (
    <section id="process" className="py-20 bg-gray-50 dark:bg-dark-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Upload & Process
          </h2>
          <p className="text-dark-600 dark:text-gray-300">
            Convert your Tamil documents to digital text in three simple steps
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg overflow-hidden">
            <Tabs defaultValue="document" className="w-full">
              <div className="border-b border-gray-200 dark:border-dark-700">
                <TabsList className="bg-transparent border-b-0">
                  <TabsTrigger
                    value="document"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 rounded-none px-2 py-2 font-medium bg-gray-100"
                  >
                    Document Processing
                  </TabsTrigger>
                  <TabsTrigger
                    value="batch"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 rounded-none px-2 py-2 font-medium bg-gray-100"
                  >
                    Batch Processing
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="document" className="p-6">
                {/* File Upload Component */}
                <div className="mb-8">
                  <FileUpload
                    value={file}
                    onChange={handleFileChange}
                    onError={handleFileError}
                    acceptedFileTypes={[
                      "image/jpeg",
                      "image/png",
                      "image/gif",
                      "application/pdf",
                    ]}
                    maxSize={10 * 1024 * 1024} // 10MB
                  />
                </div>

                {/* Processing Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Processing Options</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Checkbox
                          id="enhance"
                          checked={enhancementEnabled}
                          onCheckedChange={(checked) =>
                            setEnhancementEnabled(checked === true)
                          }
                          className="mr-2"
                        />
                        <Label htmlFor="enhance" className="text-sm">
                          Apply image enhancement
                        </Label>
                      </div>

                      <div className="flex items-center">
                        <Checkbox
                          id="spellCheck"
                          checked={spellCheckEnabled}
                          onCheckedChange={(checked) =>
                            setSpellCheckEnabled(checked === true)
                          }
                          className="mr-2"
                        />
                        <Label htmlFor="spellCheck" className="text-sm">
                          Perform NLP-based correction
                        </Label>
                      </div>

                      <div className="flex items-center">
                        <Checkbox
                          id="layoutAnalysis"
                          checked={layoutAnalysisEnabled}
                          onCheckedChange={(checked) =>
                            setLayoutAnalysisEnabled(checked === true)
                          }
                          className="mr-2"
                        />
                        <Label htmlFor="layoutAnalysis" className="text-sm">
                          Detect document layout
                        </Label>
                      </div>

                      <div className="mt-3">
                        <Label
                          htmlFor="ocr-mode"
                          className="block text-sm font-medium mb-1"
                        >
                          OCR Mode
                        </Label>
                        <select
                          id="ocr-mode"
                          value={ocrMode}
                          onChange={(e) => setOcrMode(e.target.value)}
                          className="w-full rounded-md border-gray-300 dark:border-dark-600 dark:bg-dark-700 focus:border-primary-500 focus:ring-primary-500 text-sm"
                        >
                          <option value="auto">Auto-detect</option>
                          <option value="modern">Modern Tamil</option>
                          <option value="historical">Historical Tamil</option>
                          <option value="palm">Palm Leaf</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Output Format</h3>
                    <div className="space-y-4">
                      <RadioGroup
                        value={outputFormat}
                        onValueChange={setOutputFormat}
                      >
                        <div className="flex items-center">
                          <RadioGroupItem
                            id="format-txt"
                            value="txt"
                            className="mr-2"
                          />
                          <Label htmlFor="format-txt" className="text-sm">
                            Plain Text (.txt)
                          </Label>
                        </div>

                        <div className="flex items-center">
                          <RadioGroupItem
                            id="format-pdf"
                            value="pdf"
                            className="mr-2"
                          />
                          <Label htmlFor="format-pdf" className="text-sm">
                            Searchable PDF (.pdf)
                          </Label>
                        </div>

                        <div className="flex items-center">
                          <RadioGroupItem
                            id="format-json"
                            value="json"
                            className="mr-2"
                          />
                          <Label htmlFor="format-json" className="text-sm">
                            Structured Data (.json)
                          </Label>
                        </div>
                      </RadioGroup>

                     
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={handleProcess}
                    disabled={!file || processing}
                    className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 shadow-lg shadow-primary-600/20 dark:shadow-primary-500/20 text-black dark:text-white"
                  >
                    {processing ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <WandSparkles className="mr-2 h-5 w-5" /> Process
                        Document
                      </>
                    )}
                  </Button>
                </div>

                {/* Results Preview */}
                {result && (
                  <div className="mt-10 fade-in">
                    <h3 className="font-medium text-lg mb-4">
                      Processing Results
                    </h3>

                    <div className="bg-gray-50 dark:bg-dark-900 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          Processing status
                        </span>
                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                          Completed
                        </span>
                      </div>
                      <div className="space-y-2">
                        {result.stages.map((stage, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-xs mb-1">
                              <span>{stage.name}</span>
                              <span>{stage.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-1.5">
                              <div
                                className="bg-green-500 h-1.5 rounded-full"
                                style={{ width: `${stage.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium mb-2">
                          Original Document
                        </p>
                        <div className="border border-gray-200 dark:border-dark-700 rounded-lg overflow-hidden">
                          {filePreviewUrl ? (
                            <img
                              src={filePreviewUrl}
                              className="w-full h-64 object-cover"
                              alt="Original Tamil document"
                            />
                          ) : (
                            <div className="w-full h-64 flex items-center justify-center bg-gray-100 dark:bg-dark-700 text-dark-500 dark:text-gray-400">
                              {file?.type === "application/pdf"
                                ? "PDF document preview not available"
                                : "Document preview not available"}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">
                          Extracted Text
                        </p>
                        <div className="border border-gray-200 dark:border-dark-700 rounded-lg h-64 overflow-y-auto p-4 bg-white dark:bg-dark-800 tamil-text">
                          <p className="text-dark-800 dark:text-gray-300 leading-relaxed">
                            {result.extractedText}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyText}
                        className="bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 text-dark-700 dark:text-gray-300"
                      >
                        <Copy className="mr-1 h-4 w-4" /> Copy Text
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 text-dark-700 dark:text-gray-300"
                      >
                        <Edit className="mr-1 h-4 w-4" /> Edit Text
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        className="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50"
                      >
                        <Download className="mr-1 h-4 w-4" /> Download Results
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="batch" className="p-6">
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">Batch Processing</h3>
                  <p className="text-dark-600 dark:text-gray-400 mb-6">
                    Process multiple documents at once with our batch processing
                    feature.
                  </p>
                  <p className="text-sm text-dark-500 dark:text-gray-500">
                    This feature will be available in the upcoming version.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}
