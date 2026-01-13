using UnityEngine;
using System.Collections;

public class Ball : MonoBehaviour
{
    [Header("Ball Movement Settings")]
    [SerializeField] private float rollSpeed = 5f;
    [SerializeField] private float jumpForce = 10f;
    [SerializeField] private float shakeThreshold = 2.5f;
    [SerializeField] private float shakeCooldown = 1f;

    [Header("PC Controls")]
    [SerializeField] private float pcMoveForce = 10f;
    [SerializeField] private KeyCode jumpKey = KeyCode.Space;
    [SerializeField] private KeyCode leftKey = KeyCode.A;
    [SerializeField] private KeyCode rightKey = KeyCode.D;

    [Header("Stage Sprites")]
    [SerializeField] private SpriteRenderer spriteRenderer;

    [SerializeField] private float jumpDelay = 0.5f;

    [SerializeField] private Sprite[] stage1Sprites;
    [SerializeField] private Sprite[] stage2Sprites;
    [SerializeField] private Sprite[] stage3Sprites;

    private int currentStage = 0;

    private Rigidbody2D rb;
    private bool isGrounded = false;
    private bool canShakeJump = true;
    private Vector3 lastAcceleration;

    private bool usePCControls = false;
    private bool isInBasket = false;

    private bool isJumping = false;
    private bool jumpInitiated = false;
    private Coroutine jumpCoroutine;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();

        if (spriteRenderer == null)
        {
            spriteRenderer = GetComponent<SpriteRenderer>();
        }

        DetectControlScheme();

        if (SystemInfo.supportsGyroscope && !usePCControls)
        {
            Input.gyro.enabled = true;
            lastAcceleration = Input.acceleration;
        }
        else
        {
            lastAcceleration = Vector3.zero;
        }

        SetStageSprite(0);
    }

    private void DetectControlScheme()
    {
        usePCControls = Application.platform == RuntimePlatform.WindowsPlayer ||
                       Application.platform == RuntimePlatform.WindowsEditor ||
                       Application.platform == RuntimePlatform.OSXPlayer ||
                       Application.platform == RuntimePlatform.OSXEditor ||
                       Application.platform == RuntimePlatform.LinuxPlayer;
    }

    void FixedUpdate()
    {
        if (isInBasket) return;

        if (usePCControls)
        {
            HandlePCMovement();
        }
        else
        {
            HandleGyroMovement();
        }

        UpdateJumpState();
        UpdateFlightSprite();
    }

    void Update()
    {
        if (isInBasket) return;

        if (usePCControls)
        {
            HandlePCJump();
        }
        else
        {
            HandleShakeJump();
        }
    }

    private void UpdateJumpState()
    {
        if (jumpInitiated && !isJumping && !isGrounded)
        {
            isJumping = true;
            SetStageSprite(2);
        }

        if (isGrounded && isJumping)
        {
            ResetJumpState();
        }
    }

    private void UpdateFlightSprite()
    {
        if (!jumpInitiated && !isGrounded && rb.velocity.y > 0.1f)
        {
            SetStageSprite(2);
        }
    }

    private void ResetJumpState()
    {
        isJumping = false;
        jumpInitiated = false;

        if (!isInBasket)
        {
            SetStageSprite(0);
        }
        else
        {
            SetStageSprite(3);
        }
    }

    private void HandleGyroMovement()
    {
        if (SystemInfo.supportsGyroscope)
        {
            Vector3 acceleration = Input.acceleration;
            float tiltInput = acceleration.x;

            rb.AddForce(new Vector2(tiltInput * rollSpeed * Time.fixedDeltaTime, 0f), ForceMode2D.Impulse);

            LimitHorizontalSpeed();
        }
        else
        {
            HandleTouchControls();
        }
    }

    private void HandleTouchControls()
    {
        Vector3 acceleration = Input.acceleration;
        float tiltInput = acceleration.x;

        rb.AddForce(new Vector2(tiltInput * rollSpeed * Time.fixedDeltaTime, 0f), ForceMode2D.Impulse);

        LimitHorizontalSpeed();
    }

    private void HandlePCMovement()
    {
        float moveInput = 0f;

        if (Input.GetKey(leftKey))
        {
            moveInput = -1f;
        }
        else if (Input.GetKey(rightKey))
        {
            moveInput = 1f;
        }

        if (moveInput != 0f)
        {
            rb.AddForce(new Vector2(moveInput * pcMoveForce * Time.fixedDeltaTime, 0f), ForceMode2D.Impulse);
            LimitHorizontalSpeed();
        }
        else
        {
            rb.velocity = new Vector2(rb.velocity.x * 0.95f, rb.velocity.y);
        }
    }

    private void HandlePCJump()
    {
        if (Input.GetKeyDown(jumpKey) && isGrounded && !jumpInitiated)
        {
            StartJump();
        }
    }

    private void HandleShakeJump()
    {
        Vector3 currentAcceleration = Input.acceleration;
        Vector3 shakeDelta = currentAcceleration - lastAcceleration;
        lastAcceleration = currentAcceleration;

        if (shakeDelta.sqrMagnitude > shakeThreshold * shakeThreshold && isGrounded && canShakeJump && !jumpInitiated)
        {
            StartJump();
            canShakeJump = false;
            StartCoroutine(ShakeCooldownRoutine());
        }
    }

    private void StartJump()
    {
        if (jumpCoroutine != null)
        {
            StopCoroutine(jumpCoroutine);
        }

        jumpCoroutine = StartCoroutine(JumpWithDelayRoutine());
    }

    private IEnumerator JumpWithDelayRoutine()
    {
        jumpInitiated = true;

        SetStageSprite(1);

        yield return new WaitForSeconds(jumpDelay);

        rb.AddForce(Vector2.up * jumpForce, ForceMode2D.Impulse);

        jumpCoroutine = null;
    }

    private void LimitHorizontalSpeed()
    {
        float maxHorizontalSpeed = 10f;
        if (Mathf.Abs(rb.velocity.x) > maxHorizontalSpeed)
        {
            rb.velocity = new Vector2(Mathf.Sign(rb.velocity.x) * maxHorizontalSpeed, rb.velocity.y);
        }
    }

    private IEnumerator ShakeCooldownRoutine()
    {
        yield return new WaitForSeconds(shakeCooldown);
        canShakeJump = true;
    }

    void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.CompareTag("Ground") || collision.gameObject.layer == LayerMask.NameToLayer("Ground"))
        {
            isGrounded = true;

            if (isJumping)
            {
                ResetJumpState();
            }

            if (!isInBasket)
            {
                ChangeStage();
                SetStageSprite(0);
            }
        }
    }

    void OnCollisionExit2D(Collision2D collision)
    {
        if (collision.gameObject.CompareTag("Ground") || collision.gameObject.layer == LayerMask.NameToLayer("Ground"))
        {
            isGrounded = false;
        }
    }

    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Basket"))
        {
            if (!isInBasket)
            {
                isInBasket = true;

                ResetJumpState();

                if (jumpCoroutine != null)
                {
                    StopCoroutine(jumpCoroutine);
                    jumpCoroutine = null;
                }

                SetStageSprite(3);


                rb.velocity = Vector2.zero;
                rb.isKinematic = true;

     
                StartCoroutine(FlyLeftForTwoSeconds());

               
                other.gameObject.SetActive(false);
            }
        }
    }

    private IEnumerator FlyLeftForTwoSeconds()
    {
        float duration = 2f;
        float elapsed = 0f;
        transform.localScale *= 1.5f;

        while (elapsed < duration)
        {
            Vector3 newPosition = transform.position + Vector3.left * 10f * Time.deltaTime;
            transform.position = newPosition;

            elapsed += Time.deltaTime;
            yield return null;
        }

 
        rb.isKinematic = false;
        isInBasket = false;
    }


    void OnTriggerExit2D(Collider2D other)
    {
        if (other.CompareTag("Basket") && isInBasket)
        {
            rb.gravityScale = 1f;
            isInBasket = false;

            SetStageSprite(3);
        }
    }

    public void ForceJump()
    {
        if (isGrounded && !jumpInitiated)
        {
            StartJump();
        }
    }

    private void ChangeStage()
    {
        currentStage++;
        if (currentStage >= 3)
        {
            currentStage = 0;
        }
    }

    private void SetStageSprite(int state)
    {
        if (spriteRenderer == null) return;

        Sprite[] currentStageSprites = GetCurrentStageSprites();
        if (currentStageSprites != null && currentStageSprites.Length > state && currentStageSprites[state] != null)
        {
            spriteRenderer.sprite = currentStageSprites[state];
        }
    }

    private Sprite[] GetCurrentStageSprites()
    {
        switch (currentStage)
        {
            case 0: return stage1Sprites;
            case 1: return stage2Sprites;
            case 2: return stage3Sprites;
            default: return stage1Sprites;
        }
    }
}